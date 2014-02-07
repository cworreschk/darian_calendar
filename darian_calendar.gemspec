# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift File.expand_path('../lib', __FILE__)
require 'darian_calendar/version'

Gem::Specification.new do |s|
  s.name        = 'darian_calendar'
  s.version     = DarianCalendar::VERSION
  s.date        = Time.now.strftime('%Y-%m-%d')
  s.platform    = Gem::Platform::RUBY
  s.summary     = 'Converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system.'
  s.description = 'This Ruby library converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system; Martiana, Defrost, Areosynchronous, Hensel and Aqua.'

  s.authors  = ['Christian Worreschk']
  s.email    = ['info@marsec.de']
  s.homepage = 'http://github.com/marsec/darian_calendar'
  s.licenses  = ['EUPL-1.1']

  s.require_paths    = ['lib']
  s.files            = `git ls-files`.split("\n")
  s.test_files       = `git ls-files -- {spec}/*`.split("\n")
  s.extra_rdoc_files = ['README.md', 'LICENSE.md', 'CHANGELOG.md']
end
