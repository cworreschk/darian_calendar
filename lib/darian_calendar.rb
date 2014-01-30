require 'darian_calendar/time'
require 'darian_calendar/date'

require 'darian_calendar/martiana'
require 'darian_calendar/defrost'
require 'darian_calendar/areosynchronous'
require 'darian_calendar/hensel'
require 'darian_calendar/aqua'

module DarianCalendar

  class << self

    def to_earth(object)
      case true
        when object.is_a?(DarianCalendar::Date) then nil
        when object.is_a?(DarianCalendar::Time) then nil
        when object.is_a?(DarianCalendar::DateTime) then nil
        else raise ArgumentError, "Can't convert #{arg.class}"
      end
    end

    def from_earth(object)
      case true
        when object.is_a?(::Date) then nil
        when object.is_a?(::Time) then nil
        when object.is_a?(::DateTime) then nil
        else raise ArgumentError, "Can't convert #{arg.class} to darian calendar system"
      end
    end

    def today

    end

    def now

    end

  end

end