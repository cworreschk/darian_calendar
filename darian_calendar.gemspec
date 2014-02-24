# -*- encoding: utf-8 -*-

$LOAD_PATH.unshift File.expand_path('../lib', __FILE__)
require 'darian_calendar/version'

Gem::Specification.new do |gem|
  gem.name        = 'darian_calendar'
  gem.version     = DarianCalendar::VERSION
  gem.date        = Time.now.strftime('%Y-%m-%d')
  gem.platform    = Gem::Platform::RUBY
  gem.summary     = 'Converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system.'
  gem.description = 'This Ruby library converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system; Martiana, Defrost, Areosynchronous, Hensel and Aqua.'

  gem.authors  = ['Christian Worreschk']
  gem.email    = ['info@marsec.de']
  gem.homepage = 'http://github.com/marsec/darian_calendar'
  gem.licenses  = ['EUPL-1.1']

  gem.require_paths    = ['lib']
  gem.files            = `git ls-files`.split("\n")
  gem.test_files       = `git ls-files -- {spec}/*`.split("\n")
  gem.extra_rdoc_files = ['README.md', 'LICENSE.md', 'CHANGELOG.md']
  gem.rdoc_options     = ['--line-numbers', '--inline-source', '--title', 'Darian Calendar']
end
