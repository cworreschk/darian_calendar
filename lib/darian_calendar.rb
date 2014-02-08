# encoding: utf-8

require 'darian_calendar/time'

# This Ruby library converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system; Martiana, Defrost, Areosynchronous, Hensel and Aqua.
# See http://github.com/marsec/darian_calendar for more Information.
# It's based on the JavaScript Converter which was developed by Alan Hensel and Thomas Gangale. (http://pweb.jps.net/~tgangale/mars/converter/calendar_clock.htm)
module DarianCalendar

  class << self

    # Returns the current mars time. Shortcut for 'DarianCalendar::Time.now'
    # @param type [DarianCalendar::CalendarTypes] Calendar type
    # @return [DarianCalendar::Time] current mars time
    def now(type=CalendarTypes::MARTIANA)
      DarianCalendar::Time.now(type)
    end

  end

end