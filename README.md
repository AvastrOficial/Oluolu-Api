# Oluolu-Api

Este repositorio contiene la implementación principal (main) para manejar archivos y consumir las APIs relacionadas con el sistema de Blogs de **OluOlu** , un proyecto orientado a la gestión y visualización de contenido dinámico a través de APIs REST.

---

## Descripción general

Este proyecto funciona como backend para un sistema de blogs, permitiendo la gestión, almacenamiento y visualización de posts, comentarios y usuarios mediante varias APIs integradas. La estructura y manejo de archivos están diseñados para facilitar la integración con aplicaciones frontend que consumen estas APIs y presentan la información al usuario final.

---

## Funcionalidad principal

- **Gestión de blogs:** Crear, editar, eliminar y listar blogs o posts.
- **Manejo de usuarios:** Autenticación y control de usuarios que interactúan con los blogs.
- **Comentarios:** Permite a los usuarios comentar en posts específicos.
- **Almacenamiento y visualización:** Uso de archivos y bases de datos para almacenar la información de manera eficiente y accesible.
- **APIs REST:** Comunicación mediante endpoints definidos para facilitar la integración con clientes web, móviles u otras aplicaciones.

---

## APIs incluidas en el proyecto

Las APIs son el núcleo que permiten la comunicación con el backend. A continuación un resumen de las principales APIs disponibles y su función:

| API Endpoint                     | Descripción                                                    |
|---------------------------------|----------------------------------------------------------------|
| `/blogs`                        | Gestiona operaciones CRUD sobre posts de blogs.               |
| `/users`                        | Manejo de usuarios: registro, login, perfil.                   |
| `/comments`                     | Añadir y listar comentarios asociados a posts específicos.    |
| `/categories`                   | Gestión de categorías para organizar los posts.                |
| `/files`                       | API para subir y descargar archivos asociados a los posts.    |

### Obtener imágenes en posts recomendados

- **URL base:**  
  `https://api2.oluolu.io/f/v1/blogs`

| Parámetro      | Valor por ejemplo      | Descripción                          |
|----------------|-----------------------|------------------------------------|
| `type`         | `recommend`           | Indica que se quieren publicaciones recomendadas. |
| `rcmdBlogLabel`| `image`               | Filtra solo los posts que contienen imágenes.      |
| `size`         | `10`                  | Número máximo de posts a obtener por petición.     |
| `pageToken`    | (opcional)            | Token para paginación, permite cargar más resultados en páginas siguientes. |

---
# APIs OluOlu Blogs

### 1. Obtener posts recientes

- **URL:**  
  `https://api2.oluolu.io/f/v1/blogs?type=recommend&size=30`
- **Descripción:**  
  Obtiene los últimos 10 posts publicados, ordenados por fecha de creación para mostrar contenido fresco y actualizado.

### 2. Obtener videos recomendados

- **URL:**  
  `https://api2.oluolu.io/f/v1/blogs?type=recommend&rcmdBlogLabel=video&size=30`

- **Descripción:**  
  Obtiene hasta 5 posts recomendados que contienen videos, ideal para mostrar contenido audiovisual destacado.

### 3. Obtener imágenes en posts recomendados

- **URL base:**  
  `https://api2.oluolu.io/f/v1/blogs?type=recommend&rcmdBlogLabel=image&size=30`

- **Descripción:**  
  Recupera posts recomendados que incluyen imágenes, útil para galerías o vistas tipo feed visual.

### 4. Obtener música recomendada

- **URL:**  
  `https://api2.oluolu.io/f/v1/blogs?type=recommend&rcmdBlogLabel=music&size=30`

- **Descripción:**  
  Obtiene hasta 10 posts recomendados relacionados con música, para mostrar contenido musical relevante.

---

## ¿Para qué sirve visualizar todo esto?

Visualizar la información que proporcionan estas APIs es crucial para:

- **Interactividad del usuario:** Permite que los usuarios finales puedan ver contenido actualizado, crear nuevos posts o comentar fácilmente.
- **Gestión centralizada:** Facilita la administración del contenido desde un solo punto mediante interfaces que consumen estas APIs.
- **Escalabilidad:** Al tener APIs bien definidas, se puede extender la aplicación fácilmente hacia nuevos dispositivos o servicios.
- **Experiencia de usuario:** Brinda una experiencia fluida y dinámica en las plataformas que consumen estas APIs, haciendo posible aplicaciones web y móviles modernas.
