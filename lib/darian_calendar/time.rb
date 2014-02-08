# encoding: utf-8

module DarianCalendar

  # Variantes of the Darian calendar system
  module CalendarTypes
    MARTIANA        = :martiana
    DEFROST         = :defrost
    AREOSYNCHRONOUS = :areosynchronous
    HENSEL          = :hensel
    AQUA            = :aqua
  end

  # Timestamp in the Darian calendar system
  class Time
    include Comparable

    # @return [Integer] year
    attr_reader :year
    # @return [Integer] month of the year
    attr_reader :month
    # @return [Integer] sol of the month
    attr_reader :sol
    # @return [Integer] hour of the sol
    attr_reader :hour
    # @return [Integer] minute of the hour
    attr_reader :min
    # @return [Integer] second of the minute
    attr_reader :sec
    # @return [String] full month name ("Mithuna")
    attr_reader :month_name
    # @return [String] full weeksol name ("Sol Jovis")
    attr_reader :week_sol_name
    # @return [Float] number of sols (with hour, minutes and seconds) since the earth date 0-0-0
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

    MARS_TO_EARTH_DAYS = 1.027491251
    EPOCH_OFFSET = 587744.77817
    SECONDS_A_DAY = 86400.0
    ROUND_UP_SECOND = 1/SECONDS_A_DAY;
    E_DAYS_TIL_UNIX = 719527.0

    SOL_NAMES = {
      martiana: ['Sol Solis', 'Sol Lunae', 'Sol Martis', 'Sol Mercurii', 'Sol Jovis', 'Sol Veneris', 'Sol Saturni'],
      defrost: ['Axatisol', 'Benasol', 'Ciposol', 'Domesol', 'Erjasol', 'Fulisol', 'Gavisol'],
      areosynchronous: ['Heliosol', 'Phobosol', 'Deimosol', 'Terrasol', 'Venusol', 'Mercurisol', 'Jovisol']
    }
    MONTH_NAMES = {
      martiana: ['Sagittarius', 'Dhanus', 'Capricornus', 'Makara', 'Aquarius', 'Kumbha', 'Pisces', 'Mina', 'Aries', 'Mesha', 'Taurus', 'Rishabha', 'Gemini', 'Mithuna', 'Cancer', 'Karka', 'Leo', 'Simha', 'Virgo', 'Kanya', 'Libra', 'Tula', 'Scorpius', 'Vrishika'],
      defrost: ['Adir', 'Bora', 'Coan', 'Deti', 'Edal', 'Flo', 'Geor', 'Heliba', 'Idanon', 'Jowani', 'Kireal', 'Larno', 'Medior', 'Neturima', 'Ozulikan', 'Pasurabi', 'Rudiakel', 'Safundo', 'Tiunor', 'Ulasja', 'Vadeun', 'Wakumi', 'Xetual', 'Zungo'],
      hensel: ['Vernalis', 'Duvernalis', 'Trivernalis', 'Quadrivernalis', 'Pentavernalis', 'Hexavernalis', 'Aestas', 'Duestas', 'Triestas', 'Quadrestas', 'Pentestas', 'Hexestas', 'Autumnus', 'Duautumn', 'Triautumn', 'Quadrautumn', 'Pentautumn', 'Hexautumn', 'Unember', 'Duember', 'Triember', 'Quadrember', 'Pentember', 'Hexember']
    }

    # Calculates the total number of martian sols for this earth time
    # @param earth_time [Time] Earth time
    # @return [Integer] number of sols
    def self.sols_from_earth_time(earth_time)
      days = (earth_time.to_f / SECONDS_A_DAY) + E_DAYS_TIL_UNIX
      sols = (days - EPOCH_OFFSET) / MARS_TO_EARTH_DAYS
      return sols
    end

    # Converts a time object to a mars time object
    # @param earth_time [Time] Earth time
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] mars time
    def self.from_earth(earth_time, type=CalendarTypes::MARTIANA)
      self.new(self.sols_from_earth_time(earth_time), type)
    end

    # Parses the given representation of date and time, and converts it to mars time
    # @param string [String] String with date and time
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] mars time
    def self.parse_earth(string, type=CalendarTypes::MARTIANA)
      self.from_earth(::Time.parse(string), type)
    end

    # Returns the current mars time.
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] current mars time
    def self.now(type=CalendarTypes::MARTIANA)
      self.from_earth(::Time.now, type)
    end

    # Compares two times and returns -1, zero, 1 or nil. The other should be a mars time object.
    # @param another [DarianCalendar::Time]
    # @return [Integer] Compare result
    def <=>(another)
      @total_sols <=> another.total_sols
    end

    # Return the number of sols in the given year
    # @return [Integer] Number of sols in the given year
    def sols_in_year
      self.leap? ? 669 : 668
    end

    # Returns true if the given year is a leap year
    # @return [Boolean] true if the given year is a leap year
    def leap?
      return true if (@year % 500) == 0
      return false if (@year % 100) == 0
      return true if (@year %  10) == 0
      return false if (@year % 2) == 0
      return true
    end

    # Converts the given mars time to earth time
    # @return [Time] earth time
    def to_earth
      earth_days = (@total_sols * MARS_TO_EARTH_DAYS) + EPOCH_OFFSET + ROUND_UP_SECOND
      earth_seconds = ((earth_days - E_DAYS_TIL_UNIX) * SECONDS_A_DAY) - 1
      ::Time.at(earth_seconds)
    end

    # Returns a string in an ISO 8601 format (This method doesn’t use the expanded representations).
    # @return [String] Time as a string in an ISO 8601 format
    def to_s
      sprintf('%d-%02d-%02d %02d:%02d:%02d', @year, @month, @sol, @hour, @min, @sec)
    end

    # Converts a number of martian sols to mars time.
    # @param sols optional [Float] Number of martian sols. Default is the number of sols of the the current time.
    # @param type optional [DarianCalendar::CalendarTypes] calendar type.
    # @return [DarianCalendar::Time] mars time
    def initialize(sols=nil, type=CalendarTypes::MARTIANA)
      @calendar_type = type.to_s.capitalize
      @total_sols = sols.to_f != 0 ? sols.to_f : self.sols_from_earth_time(::Time.now)

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
        when CalendarTypes::MARTIANA, CalendarTypes::HENSEL then SOL_NAMES[:martiana][@week_sol-1]
        when CalendarTypes::DEFROST then SOL_NAMES[:defrost][@week_sol-1]
        when CalendarTypes::AREOSYNCHRONOUS then SOL_NAMES[:areosynchronous][@week_sol-1]
        when CalendarTypes::AQUA then @week_sol.to_s
        else ''
      end

      @month_name = case type
        when CalendarTypes::MARTIANA then MONTH_NAMES[:martiana][@month-1]
        when CalendarTypes::DEFROST, CalendarTypes::AREOSYNCHRONOUS then MONTH_NAMES[:defrost][@month-1]
        when CalendarTypes::HENSEL then MONTH_NAMES[:hensel][@month-1]
        when CalendarTypes::AQUA then @month.to_s
        else ''
      end

      partial_sol = @total_sols - @total_sols.floor
      hour = partial_sol* 24
      min  = (hour - hour.floor) * 60

      @hour = hour.floor
      @min  = min.floor
      @sec  = ((min - min.floor) * 60).floor
    end

  end
end