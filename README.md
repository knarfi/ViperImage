# ViperImage
ViperImage is a client-side javascript plugin that offers a responsive and simple, but well styled image lightbox without dependencies.

## Motivation
On the web I found multiple versions of lightbox plugins. A big portion of those plugins are outdated in their design or their support for responsiveness. Others are very hard to implement because they need multiple JavaScript or CSS files, and sometimes even images or complete chunks of HTML that need to be added to your code.

## Usage
It is very easy to use ViperImage. You only have to add the JavaScript file to the webpage.

    <script src="viper.min.js"></script>

Your DOM should look similar to this:

    <a rel="The Netherlands" href="img/image.jpg" class="viper-img" data-viper-title="This image shows my adventure in the Netherlands" data-viper-author="Mark Nijboer">
      <img src="img/image_thumbnail.jpg">
    </a>

The attribute `rel` specifies the gallery to which this image belongs, `data-viper-title` is the title of the image, and `data-viper-author` is the author or source of the image. The three attributes mentioned above are optional.

    var images = document.querySelectorAll('.viper-img');
    var gallery = new ViperImage(images, options);

To initialize the plugin you simply add the elements as an array to the function. Although it is optional, it is also possible to add an object with options as a second argument.

The available options are:

#### Infinite
`true` / `false`

Specifies whether the lightbox is a never ending loop of images. The default value is `true`.

#### Theme
`'light'` / `'dark'`

Specifies what theme to use. The default value is `'dark'`.
