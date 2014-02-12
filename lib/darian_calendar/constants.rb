# encoding: utf-8

module DarianCalendar
  module Constants

    MARS_TO_EARTH_DAYS = 1.027491251
    EPOCH_OFFSET       = 587744.77817
    SECONDS_A_DAY      = 86400.0
    ROUND_UP_SECOND    = 1/SECONDS_A_DAY;
    E_DAYS_TIL_UNIX    = 719527.0

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

  end
end
