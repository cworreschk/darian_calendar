Gem::Specification.new do |s|
  s.name     = 'darian_calendar'
  s.version  = '0.1.0'
  s.date     = '2014-02-06'
  s.platform = Gem::Platform::RUBY
  s.summary = 'Time converter for the Darian calendar system.'
  s.description = <<-EOF
    This Ruby gem converts earth time to mars time in 5 variants of the Darian calendar system. It converts mars time in earth time too.
  EOF

  s.files            = `git ls-files`.split("\n")
  s.test_files       = `git ls-files -- {spec}/*`.split("\n")
  s.extra_rdoc_files = ['README.md', 'LICENSE.md', 'CHANGELOG.md']
  s.require_path     = 'lib'

  s.author   = 'Christian Worreschk, MarSec'
  s.email    = 'info@marsec.de'
  s.homepage = 'https://github.com/marsec/darian_calendar'
  s.license  = 'EUPL 1.1'
end
