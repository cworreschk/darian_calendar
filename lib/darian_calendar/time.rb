# encoding: utf-8

module DarianCalendar

  # Timestamp in the Darian calendar system
  class Time < DarianCalendar::Date

    # @return [Integer] hour of the sol
    attr_reader :hour
    # @return [Integer] minute of the hour
    attr_reader :min
    # @return [Integer] second of the minute
    attr_reader :sec

    # Converts a time object to a mars time object
    # @param earth_time [Time] Earth time
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] mars time
    def self.from_earth(earth_time, type=DarianCalendar::CalendarTypes::MARTIANA)
      self.new(DarianCalendar.sols_from_earth(earth_time), type)
    end

    # Parses the given representation of date and time, and converts it to mars time
    # @param string [String] String with date and time
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] mars time
    def self.parse_earth(string, type=DarianCalendar::CalendarTypes::MARTIANA)
      self.from_earth(::Time.parse(string), type)
    end

    # Creates a date object denoting the present mars day.
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] current mars date as time object
    def self.today(type=DarianCalendar::CalendarTypes::MARTIANA)
      self.new(DarianCalendar::Date.today.total_sols)
    end

    # Returns the current mars time.
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] current mars time
    def self.now(type=DarianCalendar::CalendarTypes::MARTIANA)
      self.from_earth(::Time.now, type)
    end

    # Creates a date object by year, month, sol, hour, minute and second.
    # If you pass the year with nothing else time will default to the first month 1 of that year at 00:00:00.
    # @param year [Integer] year
    # @param month [Integer] month
    # @param month [Integer] sol
    # @param month [Integer] hour
    # @param month [Integer] minute
    # @param sol [Integer] second
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] mars time
    def self.by_digits(year=nil, month=1, sol=1, hour=0, minute=0, second=0, type=DarianCalendar::CalendarTypes::MARTIANA)
      if (hour < 0) || (hour > 24)
        raise ArgumentError, 'Invalid hour'
      end
      if (minute < 0) || (minute > 60)
        raise ArgumentError, 'Invalid minute'
      end
      if (second < 0) || (second > 60)
        raise ArgumentError, 'Invalid second'
      end

      date = DarianCalendar::Date.by_digits(year, month, sol)
      sols = date.total_sols.to_f

      second+=1 if (second != 0)

      sols += (hour.to_f / 24.0)
      sols += (minute.to_f / 1440.0)
      sols += (second.to_f / 86400.0)

      return self.new(sols, type)
    end

    # Compares two times and returns -1, zero, 1 or nil. The other should be a mars time object.
    # @param another [DarianCalendar::Time]
    # @return [Integer] Compare result
    def <=>(another)
      @total_sols <=> another.total_sols
    end

    # Converts the given mars time to earth time
    # @return [Time] earth time
    def to_earth
      earth_days = (@total_sols * DarianCalendar::MARS_TO_EARTH_DAYS) + DarianCalendar::EPOCH_OFFSET + DarianCalendar::ROUND_UP_SECOND
      earth_seconds = ((earth_days - DarianCalendar::E_DAYS_TIL_UNIX) * DarianCalendar::SECONDS_A_DAY) - 1
      ::Time.at(earth_seconds)
    end

    # Returns a string in an ISO 8601 format (This method doesn’t use the expanded representations).
    # @return [String] Time as a string in an ISO 8601 format
    def to_s
      sprintf('%d-%02d-%02d %02d:%02d:%02d', @year, @month, @sol, @hour, @min, @sec)
    end

    # Returns the date of the given mars time
    # @return [DarianCalendar::Date] mars date
    def to_date
      DarianCalendar::Date.by_digits(self.year, self.month, self.sol, self.calendar_type)
    end

    # Converts a number of martian sols to mars time.
    # @param sols optional [Float] Number of martian sols. Default is the number of sols of the the current time.
    # @param type optional [DarianCalendar::CalendarTypes] calendar type.
    # @return [DarianCalendar::Time] mars time
    def initialize(sols=nil, type=DarianCalendar::CalendarTypes::MARTIANA)
      total_sols = sols.to_f != 0 ? sols.to_f : DarianCalendar.sols_from_earth(::Time.now)

      self.set_attributes(total_sols, type)

      partial_sol = @total_sols - @total_sols.floor
      hour = partial_sol* 24
      min  = (hour - hour.floor) * 60

      @hour = hour.floor
      @min  = min.floor
      @sec  = ((min - min.floor) * 60).floor
    end

  end
end