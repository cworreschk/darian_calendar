# encoding: utf-8

module DarianCalendar

  module CalendarTypes
    MARTIANA        = :martiana
    DEFROST         = :defrost
    AREOSYNCHRONOUS = :areosynchronous
    HENSEL          = :hensel
    AQUA            = :aqua
  end

  class Time
    include Comparable

    #<editor-fold desc="Attributes">

    attr_reader :year
    attr_reader :month
    attr_reader :sol

    attr_reader :hour
    attr_reader :min
    attr_reader :sec

    attr_reader :month_name
    attr_reader :week_sol_name

    attr_reader :total_sols
    attr_reader :week_sol
    attr_reader :season
    attr_reader :sol_of_season
    attr_reader :month_of_season
    attr_reader :sol_of_year

    attr_reader :calendar_type

    alias :day :sol
    alias :week_day :week_sol

    #</editor-fold>

    #<editor-fold desc="Constants">

    MARS_TO_EARTH_DAYS = 1.027491251
    EPOCH_OFFSET = 587744.77817
    SECONDS_A_DAY = 86400.0
    ROUND_UP_SECOND = 1/SECONDS_A_DAY;
    E_DAYS_TIL_UNIX = 719527.0

    SOL_MARTIANA = ['', 'Sol Solis', 'Sol Lunae', 'Sol Martis', 'Sol Mercurii', 'Sol Jovis', 'Sol Veneris', 'Sol Saturni']
    SOL_DEFROST  = ['', 'Axatisol', 'Benasol', 'Ciposol', 'Domesol', 'Erjasol', 'Fulisol', 'Gavisol']
    SOL_AREOSYNCHRONOUS = ['', 'Heliosol', 'Phobosol', 'Deimosol', 'Terrasol', 'Venusol', 'Mercurisol', 'Jovisol']

    MONTH_MARTIANA = ['', 'Sagittarius', 'Dhanus', 'Capricornus', 'Makara', 'Aquarius', 'Kumbha', 'Pisces', 'Mina', 'Aries', 'Mesha', 'Taurus', 'Rishabha', 'Gemini', 'Mithuna', 'Cancer', 'Karka', 'Leo', 'Simha', 'Virgo', 'Kanya', 'Libra', 'Tula', 'Scorpius', 'Vrishika']
    MONTH_DEFROST  = ['', 'Adir', 'Bora', 'Coan', 'Deti', 'Edal', 'Flo', 'Geor', 'Heliba', 'Idanon', 'Jowani', 'Kireal', 'Larno', 'Medior', 'Neturima', 'Ozulikan', 'Pasurabi', 'Rudiakel', 'Safundo', 'Tiunor', 'Ulasja', 'Vadeun', 'Wakumi', 'Xetual', 'Zungo']
    MONTH_HENSEL   = ['', 'Vernalis', 'Duvernalis', 'Trivernalis', 'Quadrivernalis', 'Pentavernalis', 'Hexavernalis', 'Aestas', 'Duestas', 'Triestas', 'Quadrestas', 'Pentestas', 'Hexestas', 'Autumnus', 'Duautumn', 'Triautumn', 'Quadrautumn', 'Pentautumn', 'Hexautumn', 'Unember', 'Duember', 'Triember', 'Quadrember', 'Pentember', 'Hexember']

    #</editor-fold>

    #<editor-fold desc="Class Methods">

    def self.sols_from_earth_time(earth_time)
      days = (earth_time.to_f / SECONDS_A_DAY) + E_DAYS_TIL_UNIX
      sols = (days - EPOCH_OFFSET) / MARS_TO_EARTH_DAYS
      return sols
    end

    def self.from_earth(earth_time, type=CalendarTypes::MARTIANA)
      self.new(self.sols_from_earth_time(earth_time), type)
    end

    def self.parse_earth(string, type=CalendarTypes::MARTIANA)
      self.from_earth(::Time.parse(string), type)
    end

    def self.now(type=CalendarTypes::MARTIANA)
      self.from_earth(::Time.now, type)
    end

    #</editor-fold>

    #<editor-fold desc="Instance Methods">

    def <=>(another)
      @total_sols <=> another.total_sols
    end

    def sols_in_year
      self.leap? ? 669 : 668
    end

    def leap?
      return true if (@year % 500) == 0
      return false if (@year % 100) == 0
      return true if (@year %  10) == 0
      return false if (@year % 2) == 0
      return true
    end

    def to_earth
      earth_days = (@total_sols * MARS_TO_EARTH_DAYS) + EPOCH_OFFSET + ROUND_UP_SECOND
      earth_seconds = ((earth_days - E_DAYS_TIL_UNIX) * SECONDS_A_DAY) - 1
      ::Time.at(earth_seconds)
    end

    def to_s
      sprintf('%d-%02d-%02d %02d:%02d:%02d', @year, @month, @sol, @hour, @min, @sec)
    end

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
        when CalendarTypes::MARTIANA, CalendarTypes::HENSEL then SOL_MARTIANA[@week_sol]
        when CalendarTypes::DEFROST then SOL_DEFROST[@week_sol]
        when CalendarTypes::AREOSYNCHRONOUS then SOL_AREOSYNCHRONOUS[@week_sol]
        when CalendarTypes::AQUA then @week_sol.to_s
        else ''
      end

      @month_name = case type
        when CalendarTypes::MARTIANA then MONTH_MARTIANA[@month]
        when CalendarTypes::DEFROST, CalendarTypes::AREOSYNCHRONOUS then MONTH_DEFROST[@month]
        when CalendarTypes::HENSEL then MONTH_HENSEL[@month]
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

    #</editor-fold>

  end
end