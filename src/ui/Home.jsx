import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Building, Users, MessageCircle, Star, Shield, Compass, Phone, Mail, MapPin, CheckCircle, ChevronRight } from 'lucide-react';

const Landing = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    about: false,
    projects: false,
    features: false,
    contact: false
  });

  useEffect(() => {
    // Trigger animations sequentially
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, about: true })), 800);
    setTimeout(() => setIsVisible(prev => ({ ...prev, projects: true })), 1300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, features: true })), 1800);
    setTimeout(() => setIsVisible(prev => ({ ...prev, contact: true })), 2300);
  }, []);

  // Animation classes
  const fadeInUp = (isActive) => 
    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  // Project phases sample
  const projectPhases = [
    "Planificación", 
    "Preparación del Terreno", 
    "Construcción de Cimientos", 
    "Estructura y Superestructura",
    "Instalaciones", 
    "Acabados", 
    "Inspección y Pruebas", 
    "Entrega"
  ];

  // Sample projects
  const projects = [
    {
      id: 1,
      name: "Edificio Moderno",
      phase: "Preparación del Terreno",
      description: "Edificio residencial con diseño contemporáneo y amplios espacios.",
      progress: 25
    },
    {
      id: 2,
      name: "Complejo Comercial Vertex",
      phase: "Estructura y Superestructura",
      description: "Centro comercial con tecnología inteligente y diseño sustentable.",
      progress: 65
    },
    {
      id: 3,
      name: "Residencial Los Pinos",
      phase: "Acabados",
      description: "Conjunto residencial con áreas verdes y amenidades de lujo.",
      progress: 85
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-green-800 text-white py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3 bg-white rounded-full p-1">
            <Building className="text-green-800" size={28} />
          </div>
          <span className="font-bold text-xl">Constructora Esmeralda</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#about" className="hover:text-green-300 transition-colors">Nosotros</a>
          <a href="#projects" className="hover:text-green-300 transition-colors">Proyectos</a>
          <a href="#platform" className="hover:text-green-300 transition-colors">Plataforma</a>
          <a href="#contact" className="hover:text-green-300 transition-colors">Contacto</a>
        </div>
        <button className="bg-black hover:bg-gray-900 px-4 py-2 rounded-md transition-colors">
          Área de Clientes
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-20 md:py-32 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible.hero)}`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Construimos tu futuro con excelencia
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                En Constructora Esmeralda combinamos innovación, calidad y tecnología para brindar proyectos excepcionales con seguimiento en tiempo real.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="border-2 border-white px-6 py-3 rounded-md font-bold hover:bg-white hover:text-green-800 transition-all">
                  Contactar
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-xl">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Edificio moderno Constructora Esmeralda" 
                  className="rounded-md w-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-600 p-3 rounded-full shadow-lg">
                <Building size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 md:px-12 bg-white">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible.about)}`}>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="/api/placeholder/500/600" 
                  alt="Equipo de Constructora Esmeralda" 
                  className="rounded-md w-full object-cover shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-green-600 p-4 rounded-md shadow-lg text-white">
                  <p className="font-bold text-xl">+20 años</p>
                  <p>de experiencia</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">Sobre Constructora Esmeralda</h2>
              <p className="text-lg text-gray-700 mb-6">
                Somos una empresa líder en el sector de la construcción con más de 20 años de experiencia. Nos especializamos en proyectos residenciales, comerciales e industriales, siempre con el compromiso de entregar la más alta calidad y excelencia en cada detalle.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Shield className="text-green-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Calidad Garantizada</h3>
                    <p className="text-gray-600">Los más altos estándares en cada proyecto</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Star className="text-green-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Innovación</h3>
                    <p className="text-gray-600">Técnicas y materiales de vanguardia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Users className="text-green-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Equipo Profesional</h3>
                    <p className="text-gray-600">Expertos comprometidos con la excelencia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Compass className="text-green-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Sustentabilidad</h3>
                    <p className="text-gray-600">Comprometidos con el medio ambiente</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible.projects)}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-green-800">Nuestros Proyectos</h2>
          <p className="text-lg text-gray-600 text-center mb-12">Descubre algunos de nuestros proyectos destacados</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                <img 
                  src={`/api/placeholder/400/250`} 
                  alt={project.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-green-800">{project.name}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">Fase: {project.phase}</span>
                      <span className="text-sm font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Platform Features Section */}
      <section id="platform" className="py-20 px-6 md:px-12 bg-white">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible.features)}`}>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">Seguimiento de Proyectos en Tiempo Real</h2>
              <p className="text-lg text-gray-700 mb-6">
                En Constructora Esmeralda utilizamos tecnología de punta para mantener a nuestros clientes informados durante todo el proceso de construcción:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <span className="text-gray-800">Visualización de avances con realidad aumentada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <span className="text-gray-800">Chat en tiempo real con el encargado del proyecto</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <span className="text-gray-800">Documentación y planos accesibles digitalmente</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <span className="text-gray-800">Seguimiento detallado de cada fase del proyecto</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <span className="text-gray-800">Galería de imágenes actualizada semanalmente</span>
                </div>
              </div>
              
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">Edificio Moderno</h3>
                  <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">En Progreso</span>
                </div>
                
                <div className="mb-6">
                  <img 
                    src="/api/placeholder/500/300" 
                    alt="Vista 3D del proyecto" 
                    className="w-full rounded-lg mb-2"
                  />
                  <p className="text-center text-sm text-gray-500">Vista 3D - Toca para ver en Realidad Aumentada</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Fase Actual: Preparación del Terreno</h4>
                  <div className="flex mb-4 overflow-x-auto pb-2 space-x-2">
                    {projectPhases.map((phase, index) => (
                      <div 
                        key={index} 
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                          index <= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {phase}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-bold mb-3">Chat con Encargado del Proyecto</h4>
                  <div className="bg-gray-50 p-3 rounded-lg mb-2">
                    <p className="text-sm mb-1 font-semibold text-green-800">Juan Pérez - Encargado</p>
                    <p className="text-sm">Buen día, esta semana completamos la nivelación del terreno y comenzaremos con las excavaciones.</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg mb-3 ml-8">
                    <p className="text-sm mb-1 font-semibold text-green-800">Cliente</p>
                    <p className="text-sm">Excelente, ¿cuándo podremos ver los avances?</p>
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Escribe un mensaje..." 
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700">
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-12 bg-green-800 text-white">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible.contact)}`}>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Contáctanos</h2>
              <p className="text-lg mb-8">
                Estamos aquí para ayudarte a hacer realidad tu próximo proyecto. No dudes en contactarnos para más información.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="bg-green-700 p-2 rounded-full mr-4">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <span>Av. Insurgentes Sur 1234, Ciudad de México</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-700 p-2 rounded-full mr-4">
                    <Phone className="text-white" size={20} />
                  </div>
                  <span>+52 55 1234 5678</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-700 p-2 rounded-full mr-4">
                    <Mail className="text-white" size={20} />
                  </div>
                  <span>contacto@constructoraesmeralda.com</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="bg-white text-green-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-white text-green-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2c-2.714 0-3.055.013-4.121.06-1.066.05-1.79.217-2.428.465a4.89 4.89 0 0 0-1.771 1.151A4.9 4.9 0 0 0 2.525 5.45c-.248.637-.416 1.363-.465 2.428C2.013 8.945 2 9.286 2 12c0 2.714.013 3.055.06 4.121.05 1.066.217 1.79.465 2.428a4.89 4.89 0 0 0 1.151 1.771 4.9 4.9 0 0 0 1.774 1.154c.637.248 1.363.416 2.428.465 1.066.047 1.407.06 4.121.06 2.714 0 3.055-.013 4.121-.06 1.066-.05 1.79-.217 2.428-.465a4.89 4.89 0 0 0 1.771-1.151 4.9 4.9 0 0 0 1.154-1.774c.248-.637.416-1.363.465-2.428.047-1.066.06-1.407.06-4.121 0-2.714-.013-3.055-.06-4.121-.05-1.066-.217-1.79-.465-2.428a4.89 4.89 0 0 0-1.151-1.771A4.9 4.9 0 0 0 18.55 2.525c-.637-.248-1.363-.416-2.428-.465C15.055 2.013 14.714 2 12 2Zm0 1.8c2.67 0 2.985.01 4.04.058.974.045 1.503.208 1.856.344.466.182.8.399 1.15.748.349.35.566.684.748 1.15.136.353.3.882.344 1.856.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.985-.058 4.04-.045.974-.208 1.503-.344 1.856-.182.466-.399.8-.748 1.15-.35.349-.684.566-1.15.748-.353.136-.882.3-1.856.344-1.055.048-1.37.058-4.041.058-2.67 0-2.985-.01-4.04-.058-.974-.045-1.503-.208-1.856-.344-.466-.182-.8-.399-1.15-.748a3.09 3.09 0 0 1-.748-1.15c-.136-.353-.3-.882-.344-1.856-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.985.058-4.04.045-.974.208-1.503.344-1.856.182-.466.399-.8.748-1.15.35-.349.684-.566 1.15-.748.353-.136.882-.3 1.856-.344 1.055-.048 1.37-.058 4.041-.058Zm0 12.073a3.89 3.89 0 0 1-3.873-3.874A3.89 3.89 0 0 1 12 7.127a3.89 3.89 0 0 1 3.873 3.873A3.89 3.89 0 0 1 12 14.873Zm0-9.747a5.88 5.88 0 0 0-5.873 5.873A5.88 5.88 0 0 0 12 16.873a5.88 5.88 0 0 0 5.873-5.874A5.88 5.88 0 0 0 12 5.127Zm7.5-.625a1.38 1.38 0 1 1-2.76 0 1.38 1.38 0 0 1 2.76 0Z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-white text-green-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                    <path d="M2 0a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.447 4.422a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM6.66 12h3.34v10H6.66V12Zm5.34 0h3.5v1.5c.43-1.13 1.87-1.8 3.5-1.5 2.5 0 3.5 1.5 3.5 3.5V22h-3.5v-6c0-.6-.06-1.5-1.5-1.5-1.5 0-1.5 1.5-1.5 1.5v6h-4V12Z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-white text-black p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-800">Envíanos un mensaje</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Nombre</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Teléfono</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="+52 123 456 7890"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Mensaje</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-28 focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="mr-2 bg-white rounded-full p-1">
                  <Building className="text-green-800" size={24} />
                </div>
                <span className="font-bold text-xl">Constructora Esmeralda</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Soluciones de construcción integrales con tecnología de punta y atención personalizada.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8"> 
              
              <div>
                <h3 className="font-bold mb-4 text-lg">Recursos</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutoriales</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Soporte</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4 text-lg">Empresa</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nosotros</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Clientes</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 ConstructPro. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Landing;