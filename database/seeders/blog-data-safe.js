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

      // 2. Crear autor
      const author = await findOrCreate(
        'api::author.author',
        {
          name: 'Carlos Martínez',
          slug: 'carlos-martinez',
          email: 'carlos@inpublic.com',
          bio: 'Experto en personalización textil con más de 10 años de experiencia en serigrafía, bordado y técnicas de impresión.',
          title: 'Experto en Personalización'
        },
        { slug: 'carlos-martinez' }
      );

      // 3. Crear tags
      const tag1 = await findOrCreate(
        'api::tag.tag',
        { name: 'serigrafía', slug: 'serigrafia' },
        { slug: 'serigrafia' }
      );

      const tag2 = await findOrCreate(
        'api::tag.tag',
        { name: 'vinilo textil', slug: 'vinilo-textil' },
        { slug: 'vinilo-textil' }
      );

      const tag3 = await findOrCreate(
        'api::tag.tag',
        { name: 'bordado', slug: 'bordado' },
        { slug: 'bordado' }
      );

      const tag4 = await findOrCreate(
        'api::tag.tag',
        { name: 'sublimación', slug: 'sublimacion' },
        { slug: 'sublimacion' }
      );

      const tag5 = await findOrCreate(
        'api::tag.tag',
        { name: 'técnicas', slug: 'tecnicas' },
        { slug: 'tecnicas' }
      );

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
          tags: [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id],
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

      console.log('✅ Seed seguro completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error durante el seed seguro:', error);
      throw error;
    }
  }
}; 