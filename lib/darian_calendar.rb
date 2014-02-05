# encoding: utf-8

require 'darian_calendar/time'

module DarianCalendar

  class << self

    def now
      DarianCalendar::Time.now
    end

  end

end