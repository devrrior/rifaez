
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-xl">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-colorRaffle-foreground mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Bienvenido a MiSitioWeb
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Descubre una experiencia única y navega por nuestras secciones.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button size="lg" className="bg-backgroundRaffle text-primaryRaffle hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
            Explorar Ahora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <img  alt="Placeholder para imagen principal de inicio" className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1671373319911-20b9dd0db02a" />
            </div>
            <CardHeader>
              <CardTitle className="text-primaryRaffle">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Proporcionar soluciones innovadoras y servicios de alta calidad para satisfacer las necesidades de nuestros clientes. Nos esforzamos por la excelencia en cada proyecto.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-primaryRaffle text-primaryRaffle hover:bg-primaryRaffle hover:text-colorRaffle-foreground">
                Saber Más
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800">Explora Nuestros Servicios</h2>
          <p className="text-gray-600">
            Ofrecemos una amplia gama de servicios diseñados para ayudarte a alcanzar tus objetivos. Desde consultoría hasta implementación, estamos aquí para apoyarte.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Consultoría Estratégica</li>
            <li>Desarrollo de Software a Medida</li>
            <li>Diseño de Experiencia de Usuario</li>
            <li>Soporte Técnico Especializado</li>
          </ul>
          <Button className="mt-4">Contacta con Nosotros <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default HomePage;
  