# encoding: utf-8

require 'date'
require 'time'
require 'json'
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

  MARS_TO_EARTH_DAYS = 1.027491251
  EPOCH_OFFSET       = 587744.77817
  SECONDS_A_DAY      = 86400.0
  ROUND_UP_SECOND    = 1/SECONDS_A_DAY;
  E_DAYS_TIL_UNIX    = 719527.0

  SOL_NAMES = {
    areosynchronous: ['Heliosol', 'Phobosol', 'Deimosol', 'Terrasol', 'Venusol', 'Mercurisol', 'Jovisol'],
    defrost: ['Axatisol', 'Benasol', 'Ciposol', 'Domesol', 'Erjasol', 'Fulisol', 'Gavisol'],
    martiana: ['Sol Solis', 'Sol Lunae', 'Sol Martis', 'Sol Mercurii', 'Sol Jovis', 'Sol Veneris', 'Sol Saturni']
  }
  MONTH_NAMES = {
    defrost: ['Adir', 'Bora', 'Coan', 'Deti', 'Edal', 'Flo', 'Geor', 'Heliba', 'Idanon', 'Jowani', 'Kireal', 'Larno', 'Medior', 'Neturima', 'Ozulikan', 'Pasurabi', 'Rudiakel', 'Safundo', 'Tiunor', 'Ulasja', 'Vadeun', 'Wakumi', 'Xetual', 'Zungo'],
    hensel: ['Vernalis', 'Duvernalis', 'Trivernalis', 'Quadrivernalis', 'Pentavernalis', 'Hexavernalis', 'Aestas', 'Duestas', 'Triestas', 'Quadrestas', 'Pentestas', 'Hexestas', 'Autumnus', 'Duautumn', 'Triautumn', 'Quadrautumn', 'Pentautumn', 'Hexautumn', 'Unember', 'Duember', 'Triember', 'Quadrember', 'Pentember', 'Hexember'],
    martiana: ['Sagittarius', 'Dhanus', 'Capricornus', 'Makara', 'Aquarius', 'Kumbha', 'Pisces', 'Mina', 'Aries', 'Mesha', 'Taurus', 'Rishabha', 'Gemini', 'Mithuna', 'Cancer', 'Karka', 'Leo', 'Simha', 'Virgo', 'Kanya', 'Libra', 'Tula', 'Scorpius', 'Vrishika']
  }

  class << self

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

    # Returns true if the given martian year is a leap year
    # @param year [Integer] martian year
    # @return [Boolean] true if the given year is a leap year
    def is_mars_leap_year?(year)
      return false if year.nil?
      return true if (year % 500) == 0
      return false if (year % 100) == 0
      return true if (year %  10) == 0
      return false if (year % 2) == 0
      return true
    end

  end

end