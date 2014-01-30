module DarianCalendar

  class Hensel < Martiana

    def month_name(month)
      case month
        when  1 then 'Vernalis'
        when  2 then 'Duvernalis'
        when  3 then 'Trivernalis'
        when  4 then 'Quadrivernalis'
        when  5 then 'Pentavernalis'
        when  6 then 'Hexavernalis'
        when  7 then 'Aestas'
        when  8 then 'Duestas'
        when  9 then 'Triestas'
        when 10 then 'Quadrestas'
        when 11 then 'Pentestas'
        when 12 then 'Hexestas'
        when 13 then 'Autumnus'
        when 14 then 'Duautumn'
        when 15 then 'Triautumn'
        when 16 then 'Quadrautumn'
        when 17 then 'Pentautumn'
        when 18 then 'Hexautumn'
        when 19 then 'Unember'
        when 20 then 'Duember'
        when 21 then 'Triember'
        when 22 then 'Quadrember'
        when 23 then 'Pentember'
        when 24 then 'Hexember'
      end
    end

  end

end