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

      console.log('✅ Seed seguro completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error durante el seed seguro:', error);
      throw error;
    }
  }
}; 