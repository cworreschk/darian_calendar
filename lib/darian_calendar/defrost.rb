module DarianCalendar

  class Defrost < Martiana

    def month_name(month)
      case month
        when  1 then 'Adir'
        when  2 then 'Bora'
        when  3 then 'Coan'
        when  4 then 'Deti'
        when  5 then 'Edal'
        when  6 then 'Flo'
        when  7 then 'Geor'
        when  8 then 'Heliba'
        when  9 then 'Idanon'
        when 10 then 'Jowani'
        when 11 then 'Kireal'
        when 12 then 'Larno'
        when 13 then 'Medior'
        when 14 then 'Neturima'
        when 15 then 'Ozulikan'
        when 16 then 'Pasurabi'
        when 17 then 'Rudiakel'
        when 18 then 'Safundo'
        when 19 then 'Tiunor'
        when 20 then 'Ulasja'
        when 21 then 'Vadeun'
        when 22 then 'Wakumi'
        when 23 then 'Xetual'
        when 24 then 'Zungo'
      end
    end

    def week_sol_name(week_sol)
      case week_sol
        when 1 then 'Axatisol'
        when 2 then 'Benasol'
        when 3 then 'Ciposol'
        when 4 then 'Domesol'
        when 5 then 'Erjasol'
        when 6 then 'Fulisol'
        when 7 then 'Gavisol'
      end
    end

  end

end