﻿[![npm version](https://badge.fury.io/js/angular2-expandable-list.svg)](https://badge.fury.io/js/angular2-expandable-list) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# 🚿 Waterfall by Wellflow 🚿
Waterfall is a Javascript library for Webflow that enables developers to build sliders based on SwiperJS with attributes. The Wellflow app also helps create, edit, and manage Waterfalls with an easy to use interface with full documentation.

Other slider libraries are too expensive or have limited options. Waterfall is free, and includes nearly all of the options you can find in SwiperJS. Here's what sets Waterfall apart from other Slider solutions:

 1. **Free to Use.** Waterfall is free to use - no monthly subscription.
 2. **No Custom Code.** The Wellflow App provides endless customization options without needing to write any code.
 3. **Full Documentation.** View definitions of each setting directly in the app.
 4. **Turn Swipers into Components.** After creating a swiper, you can turn it into a component for reusability.

## Table of contents

- [Waterfall](#project-name)
  - [Table of contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Supported SwiperJS Settings](#supported-swiperjs-settings)
  - [Usage](#usage)
  - [Waterfall Layout](#waterfall-layout)
  - [Attribute Naming Convention](#attribute-naming-convention)
  - [Built With](#built-with)
  - [Authors](#authors)
  - [License](#license)

## Dependencies

Waterfall bundles the latest version of SwiperJS 11.2.10 (2025-06-28) directly. If you already have a SwiperJS code snippet on your website, you can remove it and just use Waterfall.


## Installation

Add the code to the Footer Code (after the `</body>` tag) in the Webflow Project Settings.

**Latest Version**

```
<script src="https://cdn.jsdelivr.net/npm/well-waterfall"></script>
```

**Specific Version (Stable - Recommended)**

```
<script src="https://cdn.jsdelivr.net/npm/well-waterfall@1.1.11"></script>
```

## Supported SwiperJS Settings
- All General settings
- Navigation
- Pagination
- Scrollbar
- Autoplay
- Free Mode
- Grid
- Manipulation
- Parallax
- Lazy Loading
- Effects
- Thumbs
- Zoom
- Keyboard Control
- Mousewheel Control
- Hash Navigation
- History Navigation
- Controller
- Accessibility (a11y)

**Not Supported**
- Creative Effect 
- Virtual Slides


## Usage

**Use the Wellflow App**
This is the easiest way to manage Waterfall. The App allows you to create, edit, and modify existing Waterfalls with a convenient interface inside the Designer.

The App is currently being submitted to the App Marketplace.

## Waterfall Layout

The Waterfall layout uses the same layout as SwiperJS with an added "waterfall" div wrapper where the attributes are added. Swipers are initialized via the `[waterfall="SWIPER_NAME"]` attribute, where `SWIPER_NAME` is a unique identifying string.

```
<!-- Slider main container -->
<div waterfall="SWIPER_NAME" OTHER ATTRIBUTES ADDED HERE>
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        ...
      </div>
    </div>
</div>
```
Waterfall Settings can be added via the Wellflow App.

## Attribute Naming Convention

If you need to add an attribute manually for some reason, each attribute is named after the SwiperJS parameter, with a `waterfall-` prefix. For example, direction is managed through attribute `[waterfall-direction]=horizontal`.

Parameters that belong to an object (Ex. enabled parameter in the freeMode object) have the group prefixed as well - `[waterfall-free-mode-enabled]=true`. 

A full list of attributes can be found at `src/lib/attributes.ts`. Swiper Elements are managed with attributes found at `/src/lib/elements.ts`.


## Built With

- [SwiperJS 11.2.10](https://github.com/nolimits4web/swiper?tab=readme-ov-file)
- FontAwesome
- React, Typescript, Vite

## Authors

- **Kevin Gerstner** - [kevingerstner](https://github.com/kevingerstner)


## License

[MIT License](https://andreasonny.mit-license.org/2019) © Andrea SonnY
