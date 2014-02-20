# encoding: utf-8

module DarianCalendar

  # The date is a particular day of a Darian calendar year
  class Date
    include Comparable

    # @return [Integer] year
    attr_reader :year
    # @return [Integer] month of the year
    attr_reader :month
    # @return [Integer] sol of the month
    attr_reader :sol
    # @return [String] full month name ("Mithuna")
    attr_reader :month_name
    # @return [String] full weeksol name ("Sol Jovis")
    attr_reader :week_sol_name
    # @return [Integer] number of sols since the earth date 0-0-0
    attr_reader :total_sols
    # @return [String] sol of the week
    attr_reader :week_sol
    # @return [Integer] season of the year
    attr_reader :season
    # @return [Integer] sol of the season
    attr_reader :sol_of_season
    # @return [Integer] month of the season
    attr_reader :month_of_season
    # @return [Integer] sol of the year
    attr_reader :sol_of_year
    # @return [String] name of the calendar type ("Martiana")
    attr_reader :calendar_type

    alias :day :sol
    alias :week_day :week_sol

    protected

    # Set all attributes by the number of martian sols and calendar type
    # @param total_sols [Float] Total number of martian sols
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    def set_attributes(total_sols, type)
      @calendar_type = type.to_s.capitalize
      @total_sols    = total_sols

      sD  = (@total_sols / 334296).floor
      doD = (@total_sols - (sD * 334296)).floor

      sC = 0
      doC = doD
      sC = ((doD - 1) / 66859).floor if doD != 0
      doC -= ((sC * 66859) + 1) if sC != 0

      sX = 0
      doX = doC
      if sC != 0 # century that does not begin with leap day
        sX = ((doC + 1) / 6686).floor
        doX -= ((sX * 6686) - 1) if sX != 0
      else
        sX = (doC / 6686).floor
        doX -= (sX * 6686) if sX != 0
      end

      sII = 0
      doII = doX
      if (sC != 0) && (sX == 0) # decade that does not begin with leap day
        sII = (doX / 1337).floor
        doII -= (sII * 1337) if sII != 0
      else # 1338, 1337, 1337, 1337 ...
        sII = ((doX - 1) / 1337) if doX != 0
        doII -= ((sII * 1337) + 1) if sII != 0
      end

      sI = 0
      doI= doII
      if (sII == 0) && ((sX != 0) || ((sX == 0) && (sC == 0)))
        sI = (doII / 669).floor
        doI -= 669 if sI != 0
      else # 668, 669
        sI = ((doII + 1) / 669).floor
        doI -= 668 if sI != 0
      end

      @year = (500 * sD) + (100 * sC) + (10 * sX) + (2 * sII) + sI
      @season = case true # 0-3
        when (doI < 167) then 0
        when (doI < 334) then 1
        when (doI < 501) then 2
        else 3
      end

      @sol_of_season = doI - 167 * @season # 0-167
      @month_of_season = (@sol_of_season / 28).floor #  0-5
      @sol_of_year = doI

      @month = @month_of_season + (6 * @season) + 1 # 1-24
      @sol   = doI - (((@month - 1) * 28) - @season) + 1 # 1-28
      @week_sol = ((@sol - 1) % 7) + 1 # 1-7

      @week_sol_name = case type
        when DarianCalendar::CalendarTypes::MARTIANA, CalendarTypes::HENSEL then DarianCalendar::SOL_NAMES[:martiana][@week_sol-1]
        when DarianCalendar::CalendarTypes::DEFROST then DarianCalendar::SOL_NAMES[:defrost][@week_sol-1]
        when DarianCalendar::CalendarTypes::AREOSYNCHRONOUS then DarianCalendar::SOL_NAMES[:areosynchronous][@week_sol-1]
        when DarianCalendar::CalendarTypes::AQUA then @week_sol.to_s
        else ''
      end

      @month_name = case type
        when DarianCalendar::CalendarTypes::MARTIANA then DarianCalendar::MONTH_NAMES[:martiana][@month-1]
        when DarianCalendar::CalendarTypes::DEFROST, DarianCalendar::CalendarTypes::AREOSYNCHRONOUS then DarianCalendar::MONTH_NAMES[:defrost][@month-1]
        when DarianCalendar::CalendarTypes::HENSEL then DarianCalendar::MONTH_NAMES[:hensel][@month-1]
        when DarianCalendar::CalendarTypes::AQUA then @month.to_s
        else ''
      end
    end

    public

    # Converts a date object to a mars date object
    # @param earth_date [::Date] Earth date
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Date] mars date
    def self.from_earth(earth_date, type=DarianCalendar::CalendarTypes::MARTIANA)
      self.new(DarianCalendar.sols_from_earth(earth_date), type)
    end

    # Parses the given representation of a date, and converts it to a mars date
    # @param string [String] String with a date
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Date] mars date
    def self.parse_earth(string, type=DarianCalendar::CalendarTypes::MARTIANA)
      self.from_earth(::Date.parse(string), type)
    end

    # Creates a date object denoting the present mars day.
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Date] current mars date
    def self.today(type=DarianCalendar::CalendarTypes::MARTIANA)
      self.from_earth(::Date.today, type)
    end

    # Sets the model attributes from a JSON string. Returns self.
    # @param string [String] JSON string
    # @return [DarianCalendar::Date] mars date
    def self.from_json(string)
      json = JSON::parse(string)
      type =  json['calendar_type'].to_s.downcase.to_sym rescue nil
      self.new(json['total_sols'].to_f, type)
    end

    def self.by_digits(year=nil, month=1, sol=1)
      return self.today if year.nil?

      if (month < 1) || (month >24)
        raise ArgumentError, 'Invalid month'
      end
      if (day < 1) || (month > 28)
        raise ArgumentError, 'Invalid sol'
      end
      if ((month % 6) == 0) && (sol == 28) && !((month == 24) && DarianCalendar::is_mars_leap_year?(year))
        raise ArgumentError, 'Invalid sol for this month'
      end

      sols = sol + ((month-1) * 28) - ((month-1)/6).floor + 668 * year + (year / 2).floor + ((year-1) / 10).floor - ((year-1) / 100).floor + ((year-1) / 1000).floor
     return self.new(sols)
    end

    # Compares two dates and returns -1, zero, 1 or nil. The other should be a mars date object.
    # @param another [DarianCalendar::Date]
    # @return [Integer] Compare result
    def <=>(another)
      @total_sols.floor <=> another.total_sols.floor
    end

    # Return the number of sols in the given year
    # @return [Integer] Number of sols in the given year
    def sols_in_year
      self.leap? ? 669 : 668
    end

    # Returns true if the given year is a leap year
    # @return [Boolean] true if the given year is a leap year
    def leap?
      DarianCalendar::is_mars_leap_year?(@year)
    end

    # Converts the given mars date to earth date
    # @return [Date] earth date
    def to_earth
      earth_days = (@total_sols * DarianCalendar::MARS_TO_EARTH_DAYS) + DarianCalendar::EPOCH_OFFSET + DarianCalendar::ROUND_UP_SECOND
      earth_seconds = ((earth_days - DarianCalendar::E_DAYS_TIL_UNIX) * DarianCalendar::SECONDS_A_DAY) - 1
      ::Time.at(earth_seconds).to_date
    end

    # Returns a string in an ISO 8601 format (This method doesn’t use the expanded representations).
    # @return [String] Date as a string in an ISO 8601 format
    def to_s
      sprintf('%d-%02d-%02d', @year, @month, @sol)
    end

    # Returns a JSON string representing the model.
    # @return Returns a JSON string representing the model.
    def to_json
      self.as_json.to_json
    end

    # Returns a hash representing the model.
    # @return Returns a hash representing the model.
    def as_json
      json = {}
      self.instance_variables.sort.each do |attr|
        field = attr.to_s.gsub('@', '')
        json[field] = self.send(field)
      end
      return json
    end

    # Converts a number of martian sols to mars date.
    # @param sols optional [Float] Number of martian sols. Default is the number of sols of the the current date.
    # @param type optional [DarianCalendar::CalendarTypes] calendar type.
    # @return [DarianCalendar::Date] mars date
    def initialize(sols=nil, type=DarianCalendar::CalendarTypes::MARTIANA)
      total_sols = sols.to_f != 0 ? sols.to_f : DarianCalendar.sols_from_earth(::Date.today)
      self.set_attributes(total_sols.floor, type)
    end

  end

end