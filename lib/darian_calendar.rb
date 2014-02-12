# encoding: utf-8

require 'date'
require 'time'
require 'json'

require 'darian_calendar/constants'
require 'darian_calendar/date'
require 'darian_calendar/time'

# This Ruby library converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system; Martiana, Defrost, Areosynchronous, Hensel and Aqua.
# See http://github.com/marsec/darian_calendar for more Information.
# It's based on the JavaScript Converter which was developed by Alan Hensel and Thomas Gangale. (http://pweb.jps.net/~tgangale/mars/converter/calendar_clock.htm)
module DarianCalendar

  # Variantes of the Darian calendar system (Different sol and month names)
  module CalendarTypes
    MARTIANA        = :martiana
    DEFROST         = :defrost
    AREOSYNCHRONOUS = :areosynchronous
    HENSEL          = :hensel
    AQUA            = :aqua
  end

  class << self

    protected

    include DarianCalendar::Constants

    public

    # Returns the total number of martian sols for an earth date or time
    # @param earth_date_time [Date/Time] Earth date or time
    # @return [Float] number of sols
    def sols_from_earth(earth_date_time)
      seconds = earth_date_time.is_a?(::Date) ? earth_date_time.strftime("%s").to_f : earth_date_time.to_f
      days = (seconds / SECONDS_A_DAY) + E_DAYS_TIL_UNIX
      sols = (days - EPOCH_OFFSET) / MARS_TO_EARTH_DAYS
      return sols
    end

    # Returns the current mars time. Shortcut for 'DarianCalendar::Time.now'
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] current mars time
    def now(type=CalendarTypes::MARTIANA)
      DarianCalendar::Time.now(type)
    end

    # Returns the current mars time. Shortcut for 'DarianCalendar::Time.now'
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] current mars time
    def today(type=CalendarTypes::MARTIANA)
      DarianCalendar::Date.today(type)
    end

  end

end