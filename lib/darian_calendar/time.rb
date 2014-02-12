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
    def self.from_earth(earth_time, type=CalendarTypes::MARTIANA)
      self.new(DarianCalendar.sols_from_earth(earth_time), type)
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