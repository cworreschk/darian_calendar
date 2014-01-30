module DarianCalendar

  class Areosynchronous < Defrost

    def week_sol_name(week_sol)
      case week_sol
        when 1 then 'Heliosol'
        when 2 then 'Phobosol'
        when 3 then 'Deimosol'
        when 4 then 'Terrasol'
        when 5 then 'Venusol'
        when 6 then 'Mercurisol'
        when 7 then 'Jovisol'
      end
    end

  end

end