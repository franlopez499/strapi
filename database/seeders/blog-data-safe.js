module.exports = {
  async seed(strapi) {
    console.log('🌱 Iniciando seed seguro de datos del blog...');

    try {
      // Función helper para buscar o crear
      const findOrCreate = async (contentType, data, searchFields) => {
        const existing = await strapi.entityService.findMany(contentType, {
          filters: searchFields,
          limit: 1
        });

        if (existing && existing.length > 0) {
          console.log(`⏭️ ${contentType} ya existe: ${data.name || data.title || data.nombre}`);
          return existing[0];
        }

        const created = await strapi.entityService.create(contentType, { data });
        console.log(`✅ Creado ${contentType}: ${data.name || data.title || data.nombre}`);
        return created;
      };

      // 1. Crear categorías de blog
      const tutorialesCategory = await findOrCreate(
        'api::blog-category.blog-category',
        {
          name: 'Tutoriales',
          slug: 'tutoriales',
          description: 'Guías y tutoriales sobre personalización textil',
          color: 'bg-blue-100 text-blue-800',
          seo: {
            metaTitle: 'Tutoriales de Personalización | InPublic',
            metaDescription: 'Aprende las mejores técnicas de personalización textil con nuestros tutoriales paso a paso.',
            keywords: 'tutoriales, personalización textil, serigrafía, bordado'
          }
        },
        { slug: 'tutoriales' }
      );

      const consejosCategory = await findOrCreate(
        'api::blog-category.blog-category',
        {
          name: 'Consejos',
          slug: 'consejos',
          description: 'Consejos útiles para el cuidado y mantenimiento',
          color: 'bg-green-100 text-green-800'
        },
        { slug: 'consejos' }
      );

      const tendenciasCategory = await findOrCreate(
        'api::blog-category.blog-category',
        {
          name: 'Tendencias',
          slug: 'tendencias',
          description: 'Las últimas tendencias en personalización',
          color: 'bg-purple-100 text-purple-800'
        },
        { slug: 'tendencias' }
      );

      const casosEstudioCategory = await findOrCreate(
        'api::blog-category.blog-category',
        {
          name: 'Casos de Estudio',
          slug: 'casos-estudio',
          description: 'Casos reales de éxito en personalización textil',
          color: 'bg-orange-100 text-orange-800'
        },
        { slug: 'casos-estudio' }
      );

      const noticiasCategory = await findOrCreate(
        'api::blog-category.blog-category',
        {
          name: 'Noticias',
          slug: 'noticias',
          description: 'Últimas noticias del sector textil y personalización',
          color: 'bg-red-100 text-red-800'
        },
        { slug: 'noticias' }
      );

      // 2. Crear autor
      const author = await findOrCreate(
        'api::author.author',
        {
          name: 'Fernando Vazquez',
          slug: 'fernando-vazquez',
          email: 'fernando@inpublic.com',
          bio: 'Experto en personalización textil con más de 10 años de experiencia en serigrafía, bordado y técnicas de impresión.',
          title: 'Experto en Personalización'
        },
        { slug: 'fernando-vazquez' }
      );

      // 3. Crear tags
      const tagNames = [
        "camisetas personalizadas",
        "serigrafía",
        "vinilo textil",
        "bordado",
        "eventos deportivos",
        "merchandising",
        "diseño",
        "colores",
        "técnicas",
        "calidad",
        "precios",
        "tendencias 2024",
        "sublimación"
      ];

      const tags = [];
      for (const tagName of tagNames) {
        const slug = tagName.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[áàäâ]/g, 'a')
          .replace(/[éèëê]/g, 'e')
          .replace(/[íìïî]/g, 'i')
          .replace(/[óòöô]/g, 'o')
          .replace(/[úùüû]/g, 'u')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9-]/g, '');

        const tag = await findOrCreate(
          'api::tag.tag',
          { name: tagName, slug: slug },
          { slug: slug }
        );
        tags.push(tag);
      }

      // 4. Crear el blog post principal
      const mainBlogPost = await findOrCreate(
        'api::blog-post.blog-post',
        {
          title: 'Guía Completa: Cómo Elegir la Mejor Técnica de Personalización',
          slug: 'guia-completa-tecnicas-personalizacion',
          excerpt: 'Comparativa detallada entre serigrafía, vinilo textil, bordado y sublimación. Descubre cuál es la mejor opción para tu proyecto.',
          content: `
            <p>La personalización textil ha evolucionado enormemente en los últimos años, ofreciendo múltiples técnicas que se adaptan a diferentes necesidades, presupuestos y tipos de proyectos. En esta guía completa, analizaremos las cuatro técnicas principales de personalización para ayudarte a tomar la mejor decisión.</p>

            <h2>1. Serigrafía: La Técnica Clásica</h2>
            <p>La serigrafía es una de las técnicas más tradicionales y populares para la personalización textil. Consiste en transferir tinta a través de una malla tensada, creando diseños duraderos y de alta calidad.</p>
            
            <h3>Ventajas de la Serigrafía:</h3>
            <ul>
              <li>Excelente durabilidad y resistencia al lavado</li>
              <li>Colores vibrantes y opacos</li>
              <li>Ideal para grandes cantidades (más de 50 unidades)</li>
              <li>Costo por unidad muy competitivo en volúmenes altos</li>
              <li>Acabado profesional</li>
            </ul>

            <h3>Desventajas:</h3>
            <ul>
              <li>Costo inicial alto por los fotolitos</li>
              <li>No rentable para pocas unidades</li>
              <li>Limitaciones en diseños muy detallados</li>
              <li>Tiempo de preparación más largo</li>
            </ul>

            <h2>2. Vinilo Textil: Versatilidad y Rapidez</h2>
            <p>El vinilo textil es una lámina adhesiva que se corta con plotter y se aplica mediante calor y presión. Es perfecto para diseños simples y cantidades pequeñas.</p>

            <h3>Ventajas del Vinilo Textil:</h3>
            <ul>
              <li>Ideal para pocas unidades (1-50 piezas)</li>
              <li>Entrega muy rápida (24-48h)</li>
              <li>Sin costos de preparación</li>
              <li>Excelente para textos y logotipos simples</li>
              <li>Amplia gama de colores y acabados</li>
            </ul>

            <h2>3. Bordado: Elegancia y Distinción</h2>
            <p>El bordado aporta un toque de elegancia y profesionalidad único. Es especialmente popular en uniformes corporativos y ropa de alta gama.</p>

            <h2>4. Sublimación: Color Sin Límites</h2>
            <p>La sublimación permite diseños a todo color con fotografías y degradados. Es ideal para prendas deportivas técnicas.</p>

            <h2>¿Cuál Elegir Para Tu Proyecto?</h2>
            <p>La elección de la técnica depende de varios factores:</p>
            <ul>
              <li><strong>Cantidad:</strong> Serigrafía para +50 unidades, vinilo para menos</li>
              <li><strong>Diseño:</strong> Sublimación para fotografías, bordado para logos elegantes</li>
              <li><strong>Presupuesto:</strong> Vinilo para presupuestos ajustados, serigrafía para volumen</li>
              <li><strong>Urgencia:</strong> Vinilo para entregas rápidas</li>
            </ul>
          `,
          category: tutorialesCategory.id,
          author: author.id,
          tags: tags.slice(0, 5).map(tag => tag.id), // Usar los primeros 5 tags
          readTime: 8,
          views: 2340,
          likes: 89,
          featured: true,
          publishedAt: new Date(),
          seo: {
            metaTitle: 'Guía: Mejores Técnicas de Personalización | InPublic',
            metaDescription: 'Comparativa detallada entre serigrafía, vinilo textil, bordado y sublimación. Descubre cuál es la mejor opción para tu proyecto.',
            keywords: 'serigrafía, vinilo textil, bordado, sublimación, técnicas personalización, guía completa',
            noIndex: false
          }
        },
        { slug: 'guia-completa-tecnicas-personalizacion' }
      );

      // 5. Crear posts relacionados
      await findOrCreate(
        'api::blog-post.blog-post',
        {
          title: 'Cuidados y Mantenimiento de Camisetas Personalizadas',
          slug: 'cuidados-mantenimiento-camisetas-personalizadas',
          excerpt: 'Aprende cómo cuidar correctamente tus camisetas personalizadas para que duren más tiempo.',
          content: '<p>El cuidado adecuado de las camisetas personalizadas es fundamental para mantener la calidad y durabilidad de los diseños...</p>',
          category: consejosCategory.id,
          author: author.id,
          readTime: 5,
          views: 1250,
          likes: 34,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          seo: {
            metaTitle: 'Cuidados de Camisetas Personalizadas | InPublic',
            metaDescription: 'Aprende cómo cuidar correctamente tus camisetas personalizadas para que duren más tiempo.',
            keywords: 'cuidados, mantenimiento, camisetas personalizadas'
          }
        },
        { slug: 'cuidados-mantenimiento-camisetas-personalizadas' }
      );

      await findOrCreate(
        'api::blog-post.blog-post',
        {
          title: 'Tendencias en Colores para Equipos Deportivos 2024',
          slug: 'tendencias-colores-equipos-deportivos-2024',
          excerpt: 'Descubre los colores que marcarán tendencia en equipos deportivos este año.',
          content: '<p>Los colores en equipos deportivos evolucionan cada año, influenciados por tendencias de moda, psicología del color y marketing deportivo...</p>',
          category: tendenciasCategory.id,
          author: author.id,
          readTime: 6,
          views: 890,
          likes: 23,
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          seo: {
            metaTitle: 'Tendencias Colores Deportivos 2024 | InPublic',
            metaDescription: 'Descubre los colores que marcarán tendencia en equipos deportivos este año.',
            keywords: 'tendencias, colores, equipos deportivos, 2024'
          }
        },
        { slug: 'tendencias-colores-equipos-deportivos-2024' }
      );

      // 6. Crear categorías de productos
      const categoriaProductos = [
        { id: "camisetas", label: "Camisetas", count: 45 },
        { id: "sudaderas", label: "Sudaderas", count: 23 },
        { id: "polos", label: "Polos", count: 18 },
        { id: "merchandising", label: "Merchandising", count: 32 },
        { id: "vinilos", label: "Vinilos", count: 15 },
        { id: "banners", label: "Banners", count: 12 },
        { id: "chaquetas", label: "Chaquetas", count: 8 }
      ];

      const productCategories = [];
      for (const cat of categoriaProductos) {
        const productCategory = await findOrCreate(
          'api::categoria-producto.categoria-producto',
          {
            nombre: cat.label,
            slug: cat.id,
            descripcion: `Productos de ${cat.label.toLowerCase()} para personalización`,
            activa: true,
            orden: categoriaProductos.indexOf(cat)
          },
          { slug: cat.id }
        );
        productCategories.push(productCategory);
      }

      // 7. Crear técnicas de personalización
      const tecnicasData = [
        {
          nombre: 'Serigrafía',
          slug: 'serigrafia',
          descripcion: '<p>La serigrafía es una técnica de impresión que utiliza una pantalla de malla para transferir tinta sobre una superficie.</p>',
          ventajas: ['Durabilidad excelente', 'Colores vibrantes', 'Económico para grandes cantidades', 'Acabado profesional'],
          desventajas: ['Costo inicial alto', 'No rentable para pocas unidades', 'Limitado en detalles finos'],
          cantidadMinima: 50,
          cantidadOptima: 200,
          tiempoProduccion: '5-7 días laborables'
        },
        {
          nombre: 'Vinilo Textil',
          slug: 'vinilo-textil',
          descripcion: '<p>El vinilo textil es una lámina adhesiva que se corta con precisión y se aplica mediante calor.</p>',
          ventajas: ['Perfecto para pocas unidades', 'Entrega rápida', 'Sin costos de preparación', 'Variedad de colores'],
          desventajas: ['Menos duradero que serigrafía', 'Limitado a diseños simples', 'Costo por unidad más alto'],
          cantidadMinima: 1,
          cantidadOptima: 50,
          tiempoProduccion: '24-48 horas'
        },
        {
          nombre: 'Bordado',
          slug: 'bordado',
          descripcion: '<p>El bordado es una técnica que utiliza hilos para crear diseños directamente en la tela.</p>',
          ventajas: ['Aspecto premium', 'Muy duradero', 'Ideal para logos', 'Percepción de calidad'],
          desventajas: ['Costo más alto', 'Limitado en diseños complejos', 'Tiempo de producción largo'],
          cantidadMinima: 12,
          cantidadOptima: 100,
          tiempoProduccion: '7-10 días laborables'
        },
        {
          nombre: 'Sublimación',
          slug: 'sublimacion',
          descripcion: '<p>La sublimación permite imprimir diseños a todo color con fotografías y degradados.</p>',
          ventajas: ['Colores ilimitados', 'Fotografías en alta resolución', 'Muy duradero', 'Tacto suave'],
          desventajas: ['Solo en tejidos sintéticos', 'Colores claros únicamente', 'Equipamiento especializado'],
          cantidadMinima: 1,
          cantidadOptima: 100,
          tiempoProduccion: '3-5 días laborables'
        }
      ];

      const tecnicas = [];
      for (const tecnicaData of tecnicasData) {
        const tecnica = await findOrCreate(
          'api::tecnica-personalizacion.tecnica-personalizacion',
          {
            ...tecnicaData,
            activa: true,
            orden: tecnicasData.indexOf(tecnicaData)
          },
          { slug: tecnicaData.slug }
        );
        tecnicas.push(tecnica);
      }

      // 8. Crear productos
      const productosData = [
        {
          nombre: "Camiseta Deportiva Premium",
          slug: "camiseta-deportiva-premium",
          categoria: "camisetas",
          precio: 12.50,
          descripcion: "<p>Camiseta 100% algodón, ideal para equipos deportivos. Disponible en múltiples colores.</p>",
          destacado: true,
          nuevo: false,
          stock: 250
        },
        {
          nombre: "Sudadera con Capucha Unisex",
          slug: "sudadera-capucha-unisex",
          categoria: "sudaderas",
          precio: 28.90,
          descripcion: "<p>Sudadera premium con capucha, perfecta para personalización con vinilo o bordado.</p>",
          destacado: false,
          nuevo: true,
          stock: 180
        },
        {
          nombre: "Polo Empresarial Elegante",
          slug: "polo-empresarial-elegante",
          categoria: "polos",
          precio: 18.75,
          precioDescuento: 15.99,
          descripcion: "<p>Polo de alta calidad para uniformes corporativos. Tejido transpirable.</p>",
          destacado: false,
          nuevo: false,
          enOferta: true,
          stock: 120
        },
        {
          nombre: "Vinilo Textil Reflectante",
          slug: "vinilo-textil-reflectante",
          categoria: "vinilos",
          precio: 8.50,
          descripcion: "<p>Vinilo reflectante de alta visibilidad, perfecto para ropa deportiva nocturna.</p>",
          destacado: false,
          nuevo: false,
          stock: 50
        },
        {
          nombre: "Gorra Snapback Personalizable",
          slug: "gorra-snapback-personalizable",
          categoria: "merchandising",
          precio: 15.20,
          descripcion: "<p>Gorra snapback de calidad premium, ideal para bordado y personalización.</p>",
          destacado: false,
          nuevo: false,
          stock: 95
        },
        {
          nombre: "Banner Publicitario Exterior",
          slug: "banner-publicitario-exterior",
          categoria: "banners",
          precio: 45.00,
          descripcion: "<p>Banner impermeable para exteriores, con ojales reforzados y colores duraderos.</p>",
          destacado: false,
          nuevo: false,
          stock: 30
        },
        {
          nombre: "Camiseta Técnica Running",
          slug: "camiseta-tecnica-running",
          categoria: "camisetas",
          precio: 16.90,
          descripcion: "<p>Camiseta técnica con tejido transpirable, perfecta para eventos deportivos.</p>",
          destacado: true,
          nuevo: false,
          stock: 200
        },
        {
          nombre: "Taza Cerámica Personalizable",
          slug: "taza-ceramica-personalizable",
          categoria: "merchandising",
          precio: 9.95,
          descripcion: "<p>Taza de cerámica blanca, ideal para sublimación y regalos corporativos.</p>",
          destacado: false,
          nuevo: false,
          stock: 150
        },
        {
          nombre: "Chaqueta Softshell Impermeable",
          slug: "chaqueta-softshell-impermeable",
          categoria: "chaquetas",
          precio: 42.50,
          descripcion: "<p>Chaqueta softshell impermeable y transpirable, perfecta para equipos outdoor.</p>",
          destacado: true,
          nuevo: false,
          stock: 75
        }
      ];

      for (const productoData of productosData) {
        // Encontrar la categoría correspondiente
        const categoria = productCategories.find(cat => cat.slug === productoData.categoria);
        
        await findOrCreate(
          'api::producto.producto',
          {
            nombre: productoData.nombre,
            slug: productoData.slug,
            descripcion: productoData.descripcion,
            precio: productoData.precio,
            precioDescuento: productoData.precioDescuento || null,
            categoria: categoria ? categoria.id : null,
            destacado: productoData.destacado || false,
            nuevo: productoData.nuevo || false,
            enOferta: productoData.enOferta || false,
            stock: productoData.stock || 0,
            tecnicasPersonalizacion: tecnicas.slice(0, 3).map(t => t.id), // Asignar las primeras 3 técnicas
            seo: {
              metaTitle: `${productoData.nombre} | InPublic`,
              metaDescription: productoData.descripcion.replace(/<[^>]*>/g, '').substring(0, 150),
              keywords: `${productoData.nombre.toLowerCase()}, personalización, ${productoData.categoria}`
            }
          },
          { slug: productoData.slug }
        );
      }

      // 9. Crear industrias para casos de éxito
      const industriesData = [
        {
          name: 'Deportes',
          slug: 'deportes',
          description: 'Equipaciones y merchandising para equipos deportivos',
          icon: 'sports',
          color: 'bg-blue-100 text-blue-800'
        },
        {
          name: 'Empresas',
          slug: 'empresas',
          description: 'Uniformidad corporativa y merchandising empresarial',
          icon: 'business',
          color: 'bg-gray-100 text-gray-800'
        },
        {
          name: 'Eventos',
          slug: 'eventos',
          description: 'Personalización para eventos y celebraciones',
          icon: 'event',
          color: 'bg-purple-100 text-purple-800'
        },
        {
          name: 'Educación',
          slug: 'educacion',
          description: 'Uniformidad escolar y material educativo',
          icon: 'school',
          color: 'bg-green-100 text-green-800'
        }
      ];

      const industries = [];
      for (const industryData of industriesData) {
        const industry = await findOrCreate(
          'api::case-industry.case-industry',
          {
            ...industryData,
            seo: {
              metaTitle: `${industryData.name} | Casos de Éxito | InPublic`,
              metaDescription: industryData.description,
              keywords: `${industryData.name.toLowerCase()}, personalización, casos de éxito`
            }
          },
          { slug: industryData.slug }
        );
        industries.push(industry);
      }

      // 10. Crear servicios para casos de éxito
      const servicesData = [
        {
          name: 'Equipaciones Deportivas',
          slug: 'equipaciones-deportivas',
          description: 'Diseño y producción de equipaciones completas para equipos deportivos',
          icon: 'shirt',
          color: 'bg-red-100 text-red-800'
        },
        {
          name: 'Uniformidad Corporativa',
          slug: 'uniformidad-corporativa',
          description: 'Uniformes y ropa de trabajo para empresas',
          icon: 'suit',
          color: 'bg-blue-100 text-blue-800'
        },
        {
          name: 'Merchandising',
          slug: 'merchandising',
          description: 'Productos promocionales y merchandising personalizado',
          icon: 'gift',
          color: 'bg-yellow-100 text-yellow-800'
        },
        {
          name: 'Serigrafía',
          slug: 'serigrafia',
          description: 'Personalización mediante serigrafía de alta calidad',
          icon: 'print',
          color: 'bg-green-100 text-green-800'
        },
        {
          name: 'Bordado',
          slug: 'bordado',
          description: 'Bordado profesional para logos y diseños elegantes',
          icon: 'needle',
          color: 'bg-purple-100 text-purple-800'
        }
      ];

      const services = [];
      for (const serviceData of servicesData) {
        const service = await findOrCreate(
          'api::case-service.case-service',
          {
            ...serviceData,
            seo: {
              metaTitle: `${serviceData.name} | Servicios | InPublic`,
              metaDescription: serviceData.description,
              keywords: `${serviceData.name.toLowerCase()}, servicios, personalización`
            }
          },
          { slug: serviceData.slug }
        );
        services.push(service);
      }

      // 11. Buscar imagen para casos de estudio
      // Nota: La búsqueda de imagen se hace de forma opcional para evitar problemas con el pool de conexiones
      // Si necesitas asignar la imagen, hazlo manualmente desde el panel de administración después del seed
      let coverImageId = null;
      
      // Comentado temporalmente para evitar problemas con el pool de conexiones en Strapi 5
      // Descomenta y ajusta si necesitas buscar la imagen automáticamente
      /*
      try {
        const uploadedFiles = await strapi.entityService.findMany('plugin::upload.file', {
          filters: {
            name: { $contains: 'equipoCieza' }
          },
          limit: 1
        });
        
        if (uploadedFiles && uploadedFiles.length > 0) {
          coverImageId = uploadedFiles[0].id;
          console.log(`✅ Imagen encontrada para casos de estudio: ${uploadedFiles[0].name} (ID: ${coverImageId})`);
        }
      } catch (error) {
        console.log(`⚠️ No se pudo buscar la imagen equipoCieza.jpg: ${error.message}`);
      }
      */
      
      console.log('ℹ️ Los casos de estudio se crearán sin imagen. Asigna manualmente equipoCieza.jpg desde el panel de administración.');

      // 12. Crear casos de éxito
      const deportesIndustry = industries.find(i => i.slug === 'deportes');
      const empresasIndustry = industries.find(i => i.slug === 'empresas');
      const eventosIndustry = industries.find(i => i.slug === 'eventos');

      const equipacionesService = services.find(s => s.slug === 'equipaciones-deportivas');
      const serigrafiaService = services.find(s => s.slug === 'serigrafia');
      const bordadoService = services.find(s => s.slug === 'bordado');
      const merchandisingService = services.find(s => s.slug === 'merchandising');
      const uniformidadService = services.find(s => s.slug === 'uniformidad-corporativa');

      // Caso de éxito: Cieza CF
      await findOrCreate(
        'api::case-study.case-study',
        {
          title: 'Equipación Completa para Cieza CF: Camisetas y Equipaciones de Alta Calidad',
          slug: 'equipacion-completa-cieza-cf',
          summary: 'Proyecto integral de equipaciones deportivas para el equipo de fútbol Cieza CF, incluyendo camisetas de juego, entrenamiento y merchandising para aficionados.',
          clientName: 'Cieza CF',
          location: 'Cieza, Murcia',
          coverImage: coverImageId,
          industry: deportesIndustry ? deportesIndustry.id : null,
          services: [
            equipacionesService ? equipacionesService.id : null,
            serigrafiaService ? serigrafiaService.id : null,
            merchandisingService ? merchandisingService.id : null
          ].filter(Boolean),
          tags: [
            tags.find(t => t.slug === 'camisetas-personalizadas')?.id,
            tags.find(t => t.slug === 'serigrafia')?.id,
            tags.find(t => t.slug === 'eventos-deportivos')?.id
          ].filter(Boolean),
          metrics: [
            { label: 'Unidades producidas', value: '250+' },
            { label: 'Tiempo de entrega', value: '15 días' },
            { label: 'Satisfacción del cliente', value: '100%' },
            { label: 'Técnicas utilizadas', value: 'Serigrafía + Bordado' }
          ],
          content: `
            <h2>El Proyecto</h2>
            <p>Cieza CF confió en nosotros para la creación completa de su equipación para la temporada 2024. El proyecto incluía no solo las camisetas de juego, sino también equipaciones de entrenamiento y una línea completa de merchandising para los aficionados.</p>

            <h2>Desafíos y Soluciones</h2>
            <p>El principal desafío fue crear diseños que reflejaran la identidad del club mientras garantizábamos la máxima calidad y durabilidad. Trabajamos estrechamente con el equipo para desarrollar:</p>
            <ul>
              <li><strong>Camisetas de juego:</strong> Diseño personalizado con los colores del club, utilizando serigrafía de alta calidad para garantizar resistencia al lavado y al uso intensivo.</li>
              <li><strong>Equipaciones de entrenamiento:</strong> Sudaderas y pantalones técnicos con bordado del escudo del club para un acabado premium.</li>
              <li><strong>Merchandising:</strong> Gorras, bufandas y camisetas para aficionados con diseños exclusivos.</li>
            </ul>

            <h2>Resultados</h2>
            <p>El proyecto fue un éxito rotundo. Las equipaciones recibieron excelentes comentarios tanto del equipo como de los aficionados. La calidad de la serigrafía y el bordado garantizaron que las prendas mantuvieran su aspecto profesional durante toda la temporada.</p>
            <p>Además, la línea de merchandising fue muy bien recibida, generando ingresos adicionales para el club y fortaleciendo la identidad de marca del Cieza CF.</p>

            <h2>Técnicas Utilizadas</h2>
            <p>Combinamos serigrafía para las camisetas de juego, garantizando colores vibrantes y duraderos, con bordado para el escudo y detalles en las equipaciones de entrenamiento, aportando un toque de elegancia y profesionalidad.</p>
          `,
          featured: true,
          publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          seo: {
            metaTitle: 'Equipación Completa Cieza CF | Caso de Éxito | InPublic',
            metaDescription: 'Proyecto integral de equipaciones deportivas para Cieza CF. Camisetas de juego, entrenamiento y merchandising de alta calidad.',
            keywords: 'cieza cf, equipaciones deportivas, camisetas fútbol, serigrafía deportiva, merchandising deportivo'
          }
        },
        { slug: 'equipacion-completa-cieza-cf' }
      );

      // Caso de éxito adicional: Empresa tecnológica
      await findOrCreate(
        'api::case-study.case-study',
        {
          title: 'Uniformidad Corporativa para Empresa Tecnológica',
          slug: 'uniformidad-corporativa-empresa-tecnologica',
          summary: 'Diseño y producción de uniformes corporativos para una empresa tecnológica con más de 150 empleados, incluyendo polos, camisetas y chaquetas.',
          clientName: 'TechSolutions S.L.',
          location: 'Madrid',
          coverImage: coverImageId,
          industry: empresasIndustry ? empresasIndustry.id : null,
          services: [
            uniformidadService ? uniformidadService.id : null,
            bordadoService ? bordadoService.id : null
          ].filter(Boolean),
          tags: [
            tags.find(t => t.slug === 'merchandising')?.id
          ].filter(Boolean),
          metrics: [
            { label: 'Empleados', value: '150+' },
            { label: 'Prendas entregadas', value: '450' },
            { label: 'Tiempo de producción', value: '20 días' },
            { label: 'Técnica principal', value: 'Bordado' }
          ],
          content: `
            <h2>El Proyecto</h2>
            <p>TechSolutions S.L. necesitaba una uniformidad corporativa que reflejara su identidad moderna y tecnológica. El proyecto incluía polos para el día a día, camisetas para eventos y chaquetas para el invierno.</p>

            <h2>Solución Implementada</h2>
            <p>Desarrollamos una línea completa de uniformes con bordado del logo corporativo, garantizando un acabado premium y profesional. Los diseños fueron personalizados para diferentes departamentos, manteniendo la coherencia visual de la marca.</p>

            <h2>Resultados</h2>
            <p>La uniformidad corporativa fortaleció la identidad de marca de la empresa y mejoró la percepción profesional tanto interna como externamente. Los empleados valoraron positivamente la calidad de las prendas y el diseño moderno.</p>
          `,
          featured: false,
          publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          seo: {
            metaTitle: 'Uniformidad Corporativa TechSolutions | Caso de Éxito | InPublic',
            metaDescription: 'Proyecto de uniformidad corporativa para empresa tecnológica con más de 150 empleados. Bordado profesional y diseño moderno.',
            keywords: 'uniformidad corporativa, bordado empresarial, uniformes empresa, ropa corporativa'
          }
        },
        { slug: 'uniformidad-corporativa-empresa-tecnologica' }
      );

      // Caso de éxito adicional: Evento corporativo
      await findOrCreate(
        'api::case-study.case-study',
        {
          title: 'Merchandising para Evento Corporativo Multitudinario',
          slug: 'merchandising-evento-corporativo',
          summary: 'Producción de merchandising personalizado para un evento corporativo con más de 500 asistentes, incluyendo camisetas, bolsas y accesorios.',
          clientName: 'Eventos Premium S.A.',
          location: 'Barcelona',
          coverImage: coverImageId,
          industry: eventosIndustry ? eventosIndustry.id : null,
          services: [
            merchandisingService ? merchandisingService.id : null,
            serigrafiaService ? serigrafiaService.id : null
          ].filter(Boolean),
          tags: [
            tags.find(t => t.slug === 'merchandising')?.id,
            tags.find(t => t.slug === 'serigrafia')?.id
          ].filter(Boolean),
          metrics: [
            { label: 'Asistentes', value: '500+' },
            { label: 'Productos entregados', value: '750' },
            { label: 'Tiempo de producción', value: '10 días' },
            { label: 'Tipos de productos', value: '5' }
          ],
          content: `
            <h2>El Proyecto</h2>
            <p>Para un evento corporativo de gran envergadura, necesitábamos producir merchandising de alta calidad que sirviera como recuerdo del evento y herramienta de marketing.</p>

            <h2>Solución Implementada</h2>
            <p>Desarrollamos una línea completa de productos personalizados: camisetas con el logo del evento, bolsas ecológicas, gorras y accesorios. Todo con serigrafía de alta calidad para garantizar un acabado profesional.</p>

            <h2>Resultados</h2>
            <p>El merchandising fue un éxito total. Los asistentes valoraron mucho la calidad de los productos, y la empresa logró una excelente visibilidad de marca durante y después del evento.</p>
          `,
          featured: false,
          publishedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          seo: {
            metaTitle: 'Merchandising Evento Corporativo | Caso de Éxito | InPublic',
            metaDescription: 'Producción de merchandising personalizado para evento corporativo con más de 500 asistentes. Serigrafía de alta calidad.',
            keywords: 'merchandising eventos, serigrafía eventos, productos promocionales, eventos corporativos'
          }
        },
        { slug: 'merchandising-evento-corporativo' }
      );

      console.log('✅ Seed seguro completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error durante el seed seguro:', error);
      throw error;
    }
  }
}; 