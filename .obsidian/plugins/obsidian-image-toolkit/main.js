'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// العربية
var ar = {};

// čeština
var cz = {};

// Dansk
var da = {};

// Deutsch
var de = {};

// English
var en = {
    // settings
    IMAGE_TOOLKIT_SETTINGS_TITLE: "Image Toolkit Settings",
    // >>>View Trigger Settings:
    VIEW_TRIGGER_SETTINGS: 'View Trigger Settings:',
    VIEW_IMAGE_GLOBAL_NAME: 'Click and view an image globally',
    VIEW_IMAGE_GLOBAL_DESC: 'You can zoom, rotate, drag, and invert it on the popup layer when clicking an image.',
    VIEW_IMAGE_EDITOR_NAME: 'Click and view an image in the Editor Area',
    VIEW_IMAGE_EDITOR_DESC: 'Turn on this option if you want to click and view an image in the Editor Area.',
    // CPB = COMMUNITY_PLUGINS_BROWSER
    VIEW_IMAGE_IN_CPB_NAME: 'Click and view an image in the Community Plugins browser',
    VIEW_IMAGE_IN_CPB_DESC: 'Turn on this option if you want to click and view an image in the Community Plugins browser.',
    VIEW_IMAGE_WITH_A_LINK_NAME: 'Click and view an image with a link',
    VIEW_IMAGE_WITH_A_LINK_DESC: 'Turn on this option if you want to click and view an image with a link. (NOTE: The browser will be opened for you to visit the link and the image will be popped up for being viewed at the same time when you click the image.)',
    VIEW_IMAGE_OTHER_NAME: 'Click and view in the other areas except the above',
    VIEW_IMAGE_OTHER_DESC: 'Except for the above mentioned, it also supports other areas, e.g. flashcards.',
    // >>>View Detail Settings:
    VIEW_DETAILS_SETTINGS: 'View Detail Settings:',
    IMAGE_MOVE_SPEED_NAME: 'Set the moving speed of the image',
    IMAGE_MOVE_SPEED_DESC: 'When you move an image on the popup layer by keyboard (up, down, left, right), the moving speed of the image can be set here.',
    IMAGE_TIP_TOGGLE_NAME: "Display the image's zoom number",
    IMAGE_TIP_TOGGLE_DESC: "Turn on this option if you want to display the zoom number when you zoom the image.",
    IMG_FULL_SCREEN_MODE_NAME: 'Full-screen preview mode',
    // preview mode options:
    FIT: 'Fit',
    FILL: 'Fill',
    STRETCH: 'Stretch',
    // >>>Image Border Settings:
    IMAGE_BORDER_SETTINGS: 'Image Border Settings:',
    IMAGE_BORDER_TOGGLE_NAME: "Display the image's border",
    IMAGE_BORDER_TOGGLE_DESC: "The clicked image's border can be displayed after you exit previewing and close the popup layer.",
    IMAGE_BORDER_WIDTH_NAME: "Set the image's border width",
    IMAGE_BORDER_STYLE_NAME: "Set the image's border style",
    IMAGE_BORDER_COLOR_NAME: "Set the image's border color",
    // IMG_BORDER_WIDTH options:
    THIN: 'thin',
    MEDIUM: 'medium',
    THICK: 'thick',
    // IMG_BORDER_STYLE options:
    //HIDDEN: 'hidden',
    DOTTED: 'dotted',
    DASHED: 'dashed',
    SOLID: 'solid',
    DOUBLE: 'double',
    GROOVE: 'groove',
    RIDGE: 'ridge',
    INSET: 'inset',
    OUTSET: 'outset',
    // IMAGE_BORDER_COLOR_NAME options:
    BLACK: 'black',
    BLUE: 'blue',
    DARK_GREEN: 'dark green',
    GREEN: 'green',
    LIME: 'lime',
    STEEL_BLUE: 'steel blue',
    INDIGO: 'indigo',
    PURPLE: 'purple',
    GRAY: 'gray',
    DARK_RED: 'dark red',
    LIGHT_GREEN: 'light green',
    BROWN: 'brown',
    LIGHT_BLUE: 'light blue',
    SILVER: 'silver',
    RED: 'red',
    PINK: 'pink',
    ORANGE: 'orange',
    GOLD: 'gold',
    YELLOW: 'yellow',
    // >>>Gallery Navbar Settings:
    GALLERY_NAVBAR_SETTINGS: 'Gallery Navbar Settings (Experimental):',
    GALLERY_NAVBAR_TOGGLE_NAME: "Display gallery navbar (Only support reading view)",
    GALLERY_NAVBAR_TOGGLE_DESC: "All of the images in the current pane view can be displayed at the bottom of the popup layer.",
    // toolbar icon title
    ZOOM_IN: "zoom in",
    ZOOM_OUT: "zoom out",
    FULL_SCREEN: 'full screen',
    REFRESH: "refresh",
    ROTATE_LEFT: "rotate left",
    ROTATE_RIGHT: "rotate right",
    SCALE_X: 'scale x',
    SCALE_Y: 'scale y',
    INVERT_COLOR: 'invert color',
    COPY: 'copy',
    // tip:
    COPY_IMAGE_SUCCESS: 'Copy the image successfully!',
    COPY_IMAGE_ERROR: 'Error Copying the image!'
};

// British English
var enGB = {};

// Español
var es = {};

// français
var fr = {};

// हिन्दी
var hi = {};

// Bahasa Indonesia
var id = {};

// Italiano
var it = {};

// 日本語
var ja = {};

// 한국어
var ko = {};

// Nederlands
var nl = {};

// Norsk
var no = {};

// język polski	
var pl = {};

// Português
var pt = {};

// Português do Brasil
// Brazilian Portuguese
var ptBR = {};

// Română
var ro = {};

// русский
var ru = {};

// Türkçe
var tr = {};

// 简体中文
var zhCN = {
    // settings
    IMAGE_TOOLKIT_SETTINGS_TITLE: "Image Toolkit 插件设置",
    // >>> 预览触发配置：
    VIEW_TRIGGER_SETTINGS: '预览触发配置：',
    VIEW_IMAGE_GLOBAL_NAME: '支持全局预览图片',
    VIEW_IMAGE_GLOBAL_DESC: '开启后，在任何地方点击图片都可以弹出预览界面，可对图片进行缩放、旋转、拖动、和反色等。',
    VIEW_IMAGE_EDITOR_NAME: '支持在编辑区域预览图片',
    VIEW_IMAGE_EDITOR_DESC: '开启后，支持在编辑区域，点击图片预览。',
    // CPB = COMMUNITY_PLUGINS_BROWSER
    VIEW_IMAGE_IN_CPB_NAME: '支持在社区插件页面预览图片',
    VIEW_IMAGE_IN_CPB_DESC: '开启后，支持在社区插件页面，点击图片预览。',
    VIEW_IMAGE_WITH_A_LINK_NAME: '支持预览带链接的图片',
    VIEW_IMAGE_WITH_A_LINK_DESC: '开启后，支持点击带链接的图片（注意：点击该图片，会同时打开浏览器访问指定地址和弹出预览图片）',
    VIEW_IMAGE_OTHER_NAME: '支持除上述其他地方来预览图片',
    VIEW_IMAGE_OTHER_DESC: '除上述支持范围外，还支持一些其他区域，如flashcards。',
    // >>>查看细节设置：
    VIEW_DETAILS_SETTINGS: '查看细节设置：',
    IMAGE_MOVE_SPEED_NAME: '图片移动速度设置',
    IMAGE_MOVE_SPEED_DESC: '当使用键盘（上、下、左、右）移动图片时，可对图片移动速度进行设置。',
    IMAGE_TIP_TOGGLE_NAME: "展示缩放比例提示",
    IMAGE_TIP_TOGGLE_DESC: "开启后，当你缩放图片时会展示当前缩放的比例。",
    IMG_FULL_SCREEN_MODE_NAME: '全屏预览模式',
    // 全屏预览模式 下拉：
    FIT: '自适应',
    FILL: '填充',
    STRETCH: '拉伸',
    // >>>图片边框设置：
    IMAGE_BORDER_SETTINGS: '图片边框设置：',
    IMAGE_BORDER_TOGGLE_NAME: "展示被点击图片的边框",
    IMAGE_BORDER_TOGGLE_DESC: "当离开图片预览和关闭弹出层后，突出展示被点击图片的边框。",
    IMAGE_BORDER_WIDTH_NAME: "设置图片边框宽度",
    IMAGE_BORDER_STYLE_NAME: "设置图片边框样式",
    IMAGE_BORDER_COLOR_NAME: "设置图片边框颜色",
    // IMG_BORDER_WIDTH 下拉：
    THIN: '较细',
    MEDIUM: '正常',
    THICK: '较粗',
    // IMG_BORDER_STYLE  下拉：
    //HIDDEN: '隐藏',
    DOTTED: '点状',
    DASHED: '虚线',
    SOLID: '实线',
    DOUBLE: '双线',
    GROOVE: '凹槽',
    RIDGE: ' 垄状',
    INSET: '凹边',
    OUTSET: '凸边',
    // IMAGE_BORDER_COLOR_NAME  下拉：
    BLACK: '黑色',
    BLUE: '蓝色',
    DARK_GREEN: '深绿色',
    GREEN: '绿色',
    LIME: '淡黄绿色',
    STEEL_BLUE: '钢青色',
    INDIGO: '靛蓝色',
    PURPLE: '紫色',
    GRAY: '灰色',
    DARK_RED: '深红色',
    LIGHT_GREEN: '浅绿色',
    BROWN: '棕色',
    LIGHT_BLUE: '浅蓝色',
    SILVER: '银色',
    RED: '红色',
    PINK: '粉红色',
    ORANGE: '橘黄色',
    GOLD: '金色',
    YELLOW: '黄色',
    // >>>Gallery Navbar Settings:
    GALLERY_NAVBAR_SETTINGS: '图片导航设置 (体验版):',
    GALLERY_NAVBAR_TOGGLE_NAME: "展示图片导航 (仅支持阅读模式)",
    GALLERY_NAVBAR_TOGGLE_DESC: "当前文档的所有图片会展示在弹出层的底部，可随意切换展示不同图片。",
    // toolbar icon title
    ZOOM_IN: "放大",
    ZOOM_OUT: "缩小",
    FULL_SCREEN: "全屏",
    REFRESH: "刷新",
    ROTATE_LEFT: "左旋",
    ROTATE_RIGHT: "右旋",
    SCALE_X: 'x轴翻转',
    SCALE_Y: 'y轴翻转',
    INVERT_COLOR: '反色',
    COPY: '复制',
    // tip:
    COPY_IMAGE_SUCCESS: '拷贝图片成功！',
    COPY_IMAGE_ERROR: '拷贝图片失败！'
};

// 繁體中文
var zhTW = {
    // settings
    IMAGE_TOOLKIT_SETTINGS_TITLE: "image toolkit 設定",
    // toolbar icon title
    ZOOM_IN: "放大",
    ZOOM_OUT: "縮小",
    FULL_SCREEN: '全螢幕',
    REFRESH: "重整",
    ROTATE_LEFT: "向左旋轉",
    ROTATE_RIGHT: "向右旋轉",
    SCALE_X: 'x 軸縮放',
    SCALE_Y: 'y 軸縮放',
    INVERT_COLOR: '色彩反轉',
    COPY: '複製',
    COPY_IMAGE_SUCCESS: '成功複製圖片！'
};

const localeMap = {
    ar,
    cs: cz,
    da,
    de,
    en,
    "en-gb": enGB,
    es,
    fr,
    hi,
    id,
    it,
    ja,
    ko,
    nl,
    nn: no,
    pl,
    pt,
    "pt-br": ptBR,
    ro,
    ru,
    tr,
    "zh-cn": zhCN,
    "zh-tw": zhTW,
};
const locale = localeMap[obsidian.moment.locale()];
function t(str) {
    if (!locale) {
        console.error("Error: Image toolkit locale not found", obsidian.moment.locale());
    }
    return (locale && locale[str]) || en[str];
}

const ZOOM_FACTOR = 0.8;
const IMG_TOOLBAR_ICONS = [{
        key: 'zoom_in',
        title: "ZOOM_IN",
        class: 'toolbar_zoom_im'
    }, {
        key: 'zoom_out',
        title: "ZOOM_OUT",
        class: 'toolbar_zoom_out'
    }, {
        key: 'full_screen',
        title: "FULL_SCREEN",
        class: 'toolbar_full_screen'
    }, {
        key: 'refresh',
        title: "REFRESH",
        class: 'toolbar_refresh'
    }, {
        key: 'rotate_left',
        title: "ROTATE_LEFT",
        class: 'toolbar_rotate_left'
    }, {
        key: 'rotate_right',
        title: "ROTATE_RIGHT",
        class: 'toolbar_rotate_right'
    }, {
        key: 'scale_x',
        title: "SCALE_X",
        class: 'toolbar_scale_x'
    }, {
        key: 'scale_y',
        title: "SCALE_Y",
        class: 'toolbar_scale_y'
    }, {
        key: 'invert_color',
        title: "INVERT_COLOR",
        class: 'toolbar_invert_color'
    }, {
        key: 'copy',
        title: "COPY",
        class: 'toolbar_copy'
    }];
const IMG_FULL_SCREEN_MODE = {
    FIT: 'FIT',
    FILL: 'FILL',
    STRETCH: 'STRETCH'
};
const VIEW_IMG_SELECTOR = {
    EDITOR_AREAS: `.workspace-leaf-content[data-type='markdown'] img,.workspace-leaf-content[data-type='image'] img`,
    EDITOR_AREAS_NO_LINK: `.workspace-leaf-content[data-type='markdown'] img:not(a img),.workspace-leaf-content[data-type='image'] img:not(a img)`,
    CPB: `.community-plugin-readme img`,
    CPB_NO_LINK: `.community-plugin-readme img:not(a img)`,
    OTHER: `#sr-flashcard-view img`,
    OTHER_NO_LINK: `#sr-flashcard-view img:not(a img)`,
};
const IMG_BORDER_WIDTH = {
    THIN: 'thin',
    MEDIUM: 'medium',
    THICK: 'thick'
};
const IMG_BORDER_STYLE = {
    // HIDDEN: 'hidden',
    DOTTED: 'dotted',
    DASHED: 'dashed',
    SOLID: 'solid',
    DOUBLE: 'double',
    GROOVE: 'groove',
    RIDGE: 'ridge',
    INSET: 'inset',
    OUTSET: 'outset'
};
// https://www.runoob.com/cssref/css-colorsfull.html
const IMG_BORDER_COLOR = {
    BLACK: 'black',
    BLUE: 'blue',
    DARK_GREEN: 'darkgreen',
    GREEN: 'green',
    LIME: 'lime',
    STEEL_BLUE: 'steelblue',
    INDIGO: 'indigo',
    PURPLE: 'purple',
    GRAY: 'gray',
    DARK_RED: 'darkred',
    LIGHT_GREEN: 'lightgreen',
    BROWN: 'brown',
    LIGHT_BLUE: 'lightblue',
    SILVER: 'silver',
    RED: 'red',
    PINK: 'pink',
    ORANGE: 'orange',
    GOLD: 'gold',
    YELLOW: 'yellow'
};

const IMG_GLOBAL_SETTINGS = {
    // viewImageGlobal: true,
    viewImageEditor: true,
    viewImageInCPB: true,
    viewImageWithALink: true,
    viewImageOther: true,
    imageMoveSpeed: 10,
    imgTipToggle: true,
    imgFullScreenMode: IMG_FULL_SCREEN_MODE.FIT,
    imageBorderToggle: false,
    imageBorderWidth: IMG_BORDER_WIDTH.MEDIUM,
    imageBorderStyle: IMG_BORDER_STYLE.SOLID,
    imageBorderColor: IMG_BORDER_COLOR.RED,
    galleryNavbarToggle: false,
};
class ImageToolkitSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        // IMG_GLOBAL_SETTINGS.viewImageGlobal = this.plugin.settings.viewImageGlobal;
        IMG_GLOBAL_SETTINGS.viewImageEditor = this.plugin.settings.viewImageEditor;
        IMG_GLOBAL_SETTINGS.viewImageInCPB = this.plugin.settings.viewImageInCPB;
        IMG_GLOBAL_SETTINGS.viewImageWithALink = this.plugin.settings.viewImageWithALink;
        IMG_GLOBAL_SETTINGS.viewImageOther = this.plugin.settings.viewImageOther;
        IMG_GLOBAL_SETTINGS.imageMoveSpeed = this.plugin.settings.imageMoveSpeed;
        IMG_GLOBAL_SETTINGS.imgTipToggle = this.plugin.settings.imgTipToggle;
        IMG_GLOBAL_SETTINGS.imgFullScreenMode = this.plugin.settings.imgFullScreenMode;
        IMG_GLOBAL_SETTINGS.imageBorderToggle = this.plugin.settings.imageBorderToggle;
        IMG_GLOBAL_SETTINGS.imageBorderWidth = this.plugin.settings.imageBorderWidth;
        IMG_GLOBAL_SETTINGS.imageBorderStyle = this.plugin.settings.imageBorderStyle;
        IMG_GLOBAL_SETTINGS.imageBorderColor = this.plugin.settings.imageBorderColor;
        IMG_GLOBAL_SETTINGS.galleryNavbarToggle = this.plugin.settings.galleryNavbarToggle;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: t("IMAGE_TOOLKIT_SETTINGS_TITLE") });
        containerEl.createEl('h3', { text: t("VIEW_TRIGGER_SETTINGS") });
        /* new Setting(containerEl)
            .setName(t("VIEW_IMAGE_GLOBAL_NAME"))
            .setDesc(t("VIEW_IMAGE_GLOBAL_DESC"))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.viewImageGlobal)
                .onChange(async (value) => {
                    this.plugin.settings.viewImageGlobal = value;
                    if (!value) {
                        // @ts-ignore
                        this.viewImageEditorSetting?.components[0]?.setValue(false);
                        // @ts-ignore
                        this.viewImageInCPBSetting?.components[0]?.setValue(false);
                        // @ts-ignore
                        this.viewImageWithALinkSetting?.components[0]?.setValue(false);
                    }
                    this.plugin.toggleViewImage();
                    await this.plugin.saveSettings();
                })); */
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_EDITOR_NAME"))
            .setDesc(t("VIEW_IMAGE_EDITOR_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageEditor)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageEditor = value;
            this.plugin.toggleViewImage();
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_IN_CPB_NAME"))
            .setDesc(t("VIEW_IMAGE_IN_CPB_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageInCPB)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageInCPB = value;
            this.plugin.toggleViewImage();
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_WITH_A_LINK_NAME"))
            .setDesc(t("VIEW_IMAGE_WITH_A_LINK_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageWithALink)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageWithALink = value;
            this.plugin.toggleViewImage();
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("VIEW_IMAGE_OTHER_NAME"))
            .setDesc(t("VIEW_IMAGE_OTHER_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.viewImageOther)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.viewImageOther = value;
            this.plugin.toggleViewImage();
            yield this.plugin.saveSettings();
        })));
        // >>> VIEW_DETAILS_SETTINGS start
        containerEl.createEl('h3', { text: t("VIEW_DETAILS_SETTINGS") });
        let scaleText;
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_MOVE_SPEED_NAME"))
            .setDesc(t("IMAGE_MOVE_SPEED_DESC"))
            .addSlider(slider => slider
            .setLimits(1, 30, 1)
            .setValue(this.plugin.settings.imageMoveSpeed)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            scaleText.innerText = " " + value.toString();
            this.plugin.settings.imageMoveSpeed = value;
            IMG_GLOBAL_SETTINGS.imageMoveSpeed = value;
            this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            scaleText = el;
            el.style.minWidth = "2.3em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.imageMoveSpeed.toString();
        });
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_TIP_TOGGLE_NAME"))
            .setDesc(t("IMAGE_TIP_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.imgTipToggle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.imgTipToggle = value;
            IMG_GLOBAL_SETTINGS.imgTipToggle = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("IMG_FULL_SCREEN_MODE_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_FULL_SCREEN_MODE) {
                // @ts-ignore
                dropdown.addOption(key, t(key));
            }
            dropdown.setValue(IMG_GLOBAL_SETTINGS.imgFullScreenMode);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imgFullScreenMode = option;
                IMG_GLOBAL_SETTINGS.imgFullScreenMode = option;
                yield this.plugin.saveSettings();
            }));
        }));
        // >>> VIEW_DETAILS_SETTINGS end
        // >>>IMAGE_BORDER_SETTINGS start
        containerEl.createEl('h3', { text: t("IMAGE_BORDER_SETTINGS") });
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_TOGGLE_NAME"))
            .setDesc(t("IMAGE_BORDER_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.imageBorderToggle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.imageBorderToggle = value;
            IMG_GLOBAL_SETTINGS.imageBorderToggle = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_WIDTH_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_BORDER_WIDTH) {
                // @ts-ignore
                dropdown.addOption(IMG_BORDER_WIDTH[key], t(key));
            }
            dropdown.setValue(IMG_GLOBAL_SETTINGS.imageBorderWidth);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imageBorderWidth = option;
                IMG_GLOBAL_SETTINGS.imageBorderWidth = option;
                yield this.plugin.saveSettings();
            }));
        }));
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_STYLE_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_BORDER_STYLE) {
                // @ts-ignore
                dropdown.addOption(IMG_BORDER_STYLE[key], t(key));
            }
            dropdown.setValue(IMG_GLOBAL_SETTINGS.imageBorderStyle);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imageBorderStyle = option;
                IMG_GLOBAL_SETTINGS.imageBorderStyle = option;
                yield this.plugin.saveSettings();
            }));
        }));
        new obsidian.Setting(containerEl)
            .setName(t("IMAGE_BORDER_COLOR_NAME"))
            .addDropdown((dropdown) => __awaiter(this, void 0, void 0, function* () {
            for (const key in IMG_BORDER_COLOR) {
                // @ts-ignore
                dropdown.addOption(IMG_BORDER_COLOR[key], t(key));
            }
            dropdown.setValue(IMG_GLOBAL_SETTINGS.imageBorderColor);
            dropdown.onChange((option) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.imageBorderColor = option;
                IMG_GLOBAL_SETTINGS.imageBorderColor = option;
                yield this.plugin.saveSettings();
            }));
        }));
        // >>>IMAGE_BORDER_SETTINGS end
        // >>>GALLERY_NAVBAR_SETTINGS start
        containerEl.createEl('h3', { text: t("GALLERY_NAVBAR_SETTINGS") });
        new obsidian.Setting(containerEl)
            .setName(t("GALLERY_NAVBAR_TOGGLE_NAME"))
            .setDesc(t("GALLERY_NAVBAR_TOGGLE_DESC"))
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.galleryNavbarToggle)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.galleryNavbarToggle = value;
            IMG_GLOBAL_SETTINGS.galleryNavbarToggle = value;
            yield this.plugin.saveSettings();
        })));
        // >>>GALLERY_NAVBAR_SETTINGS end
    }
}

const calculateImgZoomSize = (realImg, imgInfo) => {
    const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 100;
    const windowZoomWidth = windowWidth * ZOOM_FACTOR;
    const windowZoomHeight = windowHeight * ZOOM_FACTOR;
    let tempWidth = realImg.width, tempHeight = realImg.height;
    if (realImg.height > windowZoomHeight) {
        tempHeight = windowZoomHeight;
        if ((tempWidth = tempHeight / realImg.height * realImg.width) > windowZoomWidth) {
            tempWidth = windowZoomWidth;
        }
    }
    else if (realImg.width > windowZoomWidth) {
        tempWidth = windowZoomWidth;
        tempHeight = tempWidth / realImg.width * realImg.height;
    }
    tempHeight = tempWidth * realImg.height / realImg.width;
    // cache image info: curWidth, curHeight, realWidth, realHeight, left, top
    imgInfo.left = (windowWidth - tempWidth) / 2;
    imgInfo.top = (windowHeight - tempHeight) / 2;
    imgInfo.curWidth = tempWidth;
    imgInfo.curHeight = tempHeight;
    imgInfo.realWidth = realImg.width;
    imgInfo.realHeight = realImg.height;
    /* console.log('calculateImgZoomSize', 'realImg: ' + realImg.width + ',' + realImg.height,
        'tempSize: ' + tempWidth + ',' + tempHeight,
        'windowZoomSize: ' + windowZoomWidth + ',' + windowZoomHeight,
        'windowSize: ' + windowWidth + ',' + windowHeight); */
    return imgInfo;
};
/**
 * zoom an image
 * @param ratio
 * @param imgInfo
 * @returns
 */
const zoom = (ratio, targetImgInfo, offsetSize) => {
    const zoomInFlag = ratio > 0;
    ratio = zoomInFlag ? 1 + ratio : 1 / (1 - ratio);
    const curWidth = targetImgInfo.curWidth;
    // const curHeight = TARGET_IMG_INFO.curHeight;
    let zoomRatio = curWidth * ratio / targetImgInfo.realWidth;
    const newWidth = targetImgInfo.realWidth * zoomRatio;
    const newHeight = targetImgInfo.realHeight * zoomRatio;
    const left = targetImgInfo.left + (offsetSize.offsetX - offsetSize.offsetX * ratio);
    const top = targetImgInfo.top + (offsetSize.offsetY - offsetSize.offsetY * ratio);
    // cache image info: curWidth, curHeight, left, top
    targetImgInfo.curWidth = newWidth;
    targetImgInfo.curHeight = newHeight;
    targetImgInfo.left = left;
    targetImgInfo.top = top;
    // return { newWidth, left, top };
    return targetImgInfo;
};
const transform = (targetImgInfo) => {
    let transform = 'rotate(' + targetImgInfo.rotate + 'deg)';
    if (targetImgInfo.scaleX) {
        transform += ' scaleX(-1)';
    }
    if (targetImgInfo.scaleY) {
        transform += ' scaleY(-1)';
    }
    targetImgInfo.imgViewEl.style.setProperty('transform', transform);
};
const invertImgColor = (imgEle, open) => {
    if (open) {
        imgEle.style.setProperty('filter', 'invert(1) hue-rotate(180deg)');
        imgEle.style.setProperty('mix-blend-mode', 'screen');
    }
    else {
        imgEle.style.setProperty('filter', 'none');
        imgEle.style.setProperty('mix-blend-mode', 'normal');
    }
    // open ? imgEle.addClass('image-toolkit-img-invert') : imgEle.removeClass('image-toolkit-img-invert');
};
function copyImage(imgEle, width, height) {
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imgEle.src;
    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
            // @ts-ignore
            const item = new ClipboardItem({ "image/png": blob });
            // @ts-ignore
            navigator.clipboard.write([item]);
            new obsidian.Notice(t("COPY_IMAGE_SUCCESS"));
        });
    };
    image.onerror = () => {
        new obsidian.Notice(t("COPY_IMAGE_ERROR"));
    };
}

var Md5 = /** @class */ (function () {
    function Md5() {
    }
    Md5.AddUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (!!(lX4 & lY4)) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (!!(lX4 | lY4)) {
            if (!!(lResult & 0x40000000)) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            }
            else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        }
        else {
            return (lResult ^ lX8 ^ lY8);
        }
    };
    Md5.FF = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.F(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.GG = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.G(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.HH = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.H(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.II = function (a, b, c, d, x, s, ac) {
        a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.I(b, c, d), x), ac));
        return this.AddUnsigned(this.RotateLeft(a, s), b);
    };
    Md5.ConvertToWordArray = function (string) {
        var lWordCount, lMessageLength = string.length, lNumberOfWords_temp1 = lMessageLength + 8, lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64, lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16, lWordArray = Array(lNumberOfWords - 1), lBytePosition = 0, lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    Md5.WordToHex = function (lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    Md5.Utf8Encode = function (string) {
        var utftext = "", c;
        string = string.replace(/\r\n/g, "\n");
        for (var n = 0; n < string.length; n++) {
            c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    Md5.init = function (string) {
        var temp;
        if (typeof string !== 'string')
            string = JSON.stringify(string);
        this._string = this.Utf8Encode(string);
        this.x = this.ConvertToWordArray(this._string);
        this.a = 0x67452301;
        this.b = 0xEFCDAB89;
        this.c = 0x98BADCFE;
        this.d = 0x10325476;
        for (this.k = 0; this.k < this.x.length; this.k += 16) {
            this.AA = this.a;
            this.BB = this.b;
            this.CC = this.c;
            this.DD = this.d;
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k], this.S11, 0xD76AA478);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 1], this.S12, 0xE8C7B756);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S13, 0x242070DB);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 3], this.S14, 0xC1BDCEEE);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S11, 0xF57C0FAF);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 5], this.S12, 0x4787C62A);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S13, 0xA8304613);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 7], this.S14, 0xFD469501);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S11, 0x698098D8);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 9], this.S12, 0x8B44F7AF);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S13, 0xFFFF5BB1);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 11], this.S14, 0x895CD7BE);
            this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S11, 0x6B901122);
            this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 13], this.S12, 0xFD987193);
            this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S13, 0xA679438E);
            this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 15], this.S14, 0x49B40821);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S21, 0xF61E2562);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 6], this.S22, 0xC040B340);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S23, 0x265E5A51);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k], this.S24, 0xE9B6C7AA);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S21, 0xD62F105D);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 10], this.S22, 0x2441453);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S23, 0xD8A1E681);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 4], this.S24, 0xE7D3FBC8);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S21, 0x21E1CDE6);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 14], this.S22, 0xC33707D6);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S23, 0xF4D50D87);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 8], this.S24, 0x455A14ED);
            this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S21, 0xA9E3E905);
            this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 2], this.S22, 0xFCEFA3F8);
            this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S23, 0x676F02D9);
            this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 12], this.S24, 0x8D2A4C8A);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S31, 0xFFFA3942);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 8], this.S32, 0x8771F681);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S33, 0x6D9D6122);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 14], this.S34, 0xFDE5380C);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S31, 0xA4BEEA44);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 4], this.S32, 0x4BDECFA9);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S33, 0xF6BB4B60);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 10], this.S34, 0xBEBFBC70);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S31, 0x289B7EC6);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k], this.S32, 0xEAA127FA);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S33, 0xD4EF3085);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 6], this.S34, 0x4881D05);
            this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S31, 0xD9D4D039);
            this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 12], this.S32, 0xE6DB99E5);
            this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S33, 0x1FA27CF8);
            this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 2], this.S34, 0xC4AC5665);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k], this.S41, 0xF4292244);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 7], this.S42, 0x432AFF97);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S43, 0xAB9423A7);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 5], this.S44, 0xFC93A039);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S41, 0x655B59C3);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 3], this.S42, 0x8F0CCC92);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S43, 0xFFEFF47D);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 1], this.S44, 0x85845DD1);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S41, 0x6FA87E4F);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 15], this.S42, 0xFE2CE6E0);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S43, 0xA3014314);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 13], this.S44, 0x4E0811A1);
            this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S41, 0xF7537E82);
            this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 11], this.S42, 0xBD3AF235);
            this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S43, 0x2AD7D2BB);
            this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 9], this.S44, 0xEB86D391);
            this.a = this.AddUnsigned(this.a, this.AA);
            this.b = this.AddUnsigned(this.b, this.BB);
            this.c = this.AddUnsigned(this.c, this.CC);
            this.d = this.AddUnsigned(this.d, this.DD);
        }
        temp = this.WordToHex(this.a) + this.WordToHex(this.b) + this.WordToHex(this.c) + this.WordToHex(this.d);
        return temp.toLowerCase();
    };
    Md5.x = Array();
    Md5.S11 = 7;
    Md5.S12 = 12;
    Md5.S13 = 17;
    Md5.S14 = 22;
    Md5.S21 = 5;
    Md5.S22 = 9;
    Md5.S23 = 14;
    Md5.S24 = 20;
    Md5.S31 = 4;
    Md5.S32 = 11;
    Md5.S33 = 16;
    Md5.S34 = 23;
    Md5.S41 = 6;
    Md5.S42 = 10;
    Md5.S43 = 15;
    Md5.S44 = 21;
    Md5.RotateLeft = function (lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); };
    Md5.F = function (x, y, z) { return (x & y) | ((~x) & z); };
    Md5.G = function (x, y, z) { return (x & z) | (y & (~z)); };
    Md5.H = function (x, y, z) { return (x ^ y ^ z); };
    Md5.I = function (x, y, z) { return (y ^ (x | (~z))); };
    return Md5;
}());

class FileCto {
    constructor(path, ctime, mtime) {
        this.path = path;
        this.ctime = ctime;
        this.mtime = mtime;
    }
}

class GalleryImgCacheCto {
    constructor(file, galleryImgList, mtime) {
        this.file = file;
        this.galleryImgList = galleryImgList;
        this.mtime = mtime;
    }
}

class GalleryImgCto {
    constructor(alt, src) {
        this.alt = alt;
        this.src = src;
    }
}

/* // const imgList: Array<GalleryImg> = parseMarkDown(plugin, activeView.sourceMode?.cmEditor, activeView.file.path);
export const parseMarkDown = (plugin: ImageToolkitPlugin, cm: CodeMirror.Editor, filePath: string) => {
    let line, lineText;
    for (let i = 0, lastLine = cm.lastLine(); i <= lastLine; i++) {
        if (!(line = cm.lineInfo(i))) continue;
        if (!(lineText = line.text)) continue;
        console.debug((i + 1) + ' line: ' + lineText);
    }
} */
const parseActiveViewData = (plugin, lines, file) => {
    if (!lines || 0 >= lines.length)
        return null;
    let lineText;
    let isCodeArea = false;
    let textArr;
    const imgList = new Array();
    for (let i = 0, len = lines.length; i < len; i++) {
        if (!(lineText = lines[i]))
            continue;
        // console.log((i + 1) + ' line: ' + lineText);
        if (lineText.startsWith('```')) {
            isCodeArea = !isCodeArea;
            continue;
        }
        if (isCodeArea)
            continue;
        if (textArr = getNonCodeAreaTexts(lineText)) {
            for (const text of textArr) {
                extractImage(text, imgList);
            }
        }
        else {
            extractImage(lineText, imgList);
        }
    }
    const filePath = file.path;
    for (let i = 0, len = imgList.length; i < len; i++) {
        const img = imgList[i];
        if (img.convert) {
            const imageFile = plugin.app.metadataCache.getFirstLinkpathDest(decodeURIComponent(img.src), filePath);
            img.src = imageFile ? plugin.app.vault.getResourcePath(imageFile) : '';
        }
        img.hash = md5Img(img.alt, img.src);
        img.match = null;
        img.name = null;
    }
    return new GalleryImgCacheCto(new FileCto(file.path, file.stat.ctime, file.stat.mtime), imgList, new Date().getTime());
};
const getNonCodeAreaTexts = (lineText) => {
    let textArr = [];
    const idx1 = lineText.indexOf('`');
    if (0 > idx1)
        return null;
    const idx2 = lineText.lastIndexOf('`');
    if (idx1 === idx2)
        return null;
    if (idx1 > 0)
        textArr.push(lineText.substring(0, idx1));
    if (lineText.length - 1 > idx2)
        textArr.push(lineText.substring(idx2 + 1));
    return textArr;
};
const IMAGE_LINK_REGEX1 = /\[\s*?(!\[(.*?)\]\((.*?)\))\s*?\]\(.*?\)/; // 1-link: [ ![alt1|alt2|...|altn|width](src) ](https://...)
const IMAGE_REGEX1 = /!\[(.*?)\]\((.*?)\)/; // 1: ![alt1|alt2|...|altn|width](src)
const IMAGE_LINK_REGEX2 = /\[\s*?(!\[\[(.*?[jpe?g|png|gif|svg|bmp].*?)\]\])\s*?\]\(.*?\)/i; // 2-link: [ ![[src|alt1|alt2|width]] ](https://...)
const IMAGE_REGEX2 = /!\[\[(.*?[jpe?g|png|gif|svg|bmp].*?)\]\]/i; // 2: ![[src|alt1|alt2|width]]
const SRC_LINK_REGEX = /[a-z][a-z0-9+\-.]+:\/.*/i; // match link: http://, file://, app:// 
const SRC_IMG_REGREX = /.*?\.jpe?g|png|gif|svg|bmp/i; // match image ext: .jpg/.jpeg/.png/.gif/.svg/.bmp
const IMG_TAG_LINK_SRC_REGEX = /<a.*?(<img.*?src=[\'"](.*?)[\'"].*?\/?>).*?\/a>/i; // 3-a-img-src: <a> <img ... src=''/> </a>
const IMG_TAG_SRC_REGEX = /<img.*?src=[\'"](.*?)[\'"].*?\/?>/i; // 3-img-src: <img ... src='' />
const IMG_TAG_ALT_REGEX = /<img.*?alt=[\'"](.*?)[\'"].*?\/?>/i; // 3-img-alt: <img ... alt='' />
const FULL_PATH_REGEX = /^[a-z]\:.*?[jpe?g|png|gif|svg|bmp]/i;
const IMG_MATCH_MIN_LEN = 7;
const extractImage = (text, imgList) => {
    let img;
    if (!(img = matchImage1(text))) {
        if (!(img = matchImage2(text))) {
            if (!(img = matchImageTag(text))) {
                return;
            }
        }
    }
    imgList.push(img);
    if (img.match) {
        const idx = img.match.index + img.match[0].length;
        if (idx > text.length - IMG_MATCH_MIN_LEN)
            return;
        extractImage(text.substring(idx), imgList);
    }
};
/**
 * ![alt1|alt2|...|altn|width](src)
 * @param text
 * @returns
 */
const matchImage1 = (text) => {
    var _a;
    let match = text.match(IMAGE_LINK_REGEX1); // 1-link: [ ![alt1|alt2|...|altn|width](src) ](https://...)
    let link = false;
    let alt, src;
    if (match) {
        link = true;
        alt = match[2];
        src = match[3];
    }
    else {
        match = text.match(IMAGE_REGEX1); // 1: ![alt1|alt2|...|altn|width](src)
        if (match) {
            if (alt = match[1]) {
                if (0 <= alt.indexOf('[') && 0 <= alt.indexOf(']'))
                    return;
            }
            src = match[2];
        }
    }
    if (!match)
        return null;
    const img = new GalleryImgCto();
    img.link = link;
    img.match = match;
    img.alt = alt;
    img.src = src;
    let width;
    if (img.src) {
        if (SRC_LINK_REGEX.test(img.src)) { // 1.2: match link: http://, file://, app://local/
            if (img.src.startsWith('file://')) {
                img.src = img.src.replace(/^file:\/+/, 'app://local/');
            }
        }
        else if (SRC_IMG_REGREX.test(img.src)) { // 1.3: match image ext: .jpg/.jpeg/.png/.gif/.svg/.bmp
            const srcArr = img.src.split('/');
            if (srcArr && 0 < srcArr.length) {
                img.name = srcArr[srcArr.length - 1];
            }
            img.convert = true;
        }
    }
    const altArr = (_a = img.alt) === null || _a === void 0 ? void 0 : _a.split('\|'); // match[1] = alt1|alt2|...|altn|width
    if (altArr && 1 < altArr.length) {
        if (/\d+/.test(width = altArr[altArr.length - 1])) {
            img.alt = img.alt.substring(0, img.alt.length - width.length - 1);
        }
    }
    return img;
};
/**
 * ![[src|alt1|alt2|width]]
 * @param text
 * @returns
 */
const matchImage2 = (text) => {
    let match = text.match(IMAGE_LINK_REGEX2); // 2-link: [ ![[src|alt1|alt2|width]] ](https://...)
    let link = false;
    let content;
    if (match) {
        link = true;
        content = match[2];
    }
    else {
        match = text.match(IMAGE_REGEX2); // 2: ![[src|alt1|alt2|width]]
        content = match ? match[1] : null;
    }
    if (!match)
        return null;
    const img = new GalleryImgCto();
    img.link = link;
    img.match = match;
    const contentArr = content === null || content === void 0 ? void 0 : content.split('|');
    if (contentArr && 0 < contentArr.length && (img.src = contentArr[0])) {
        const srcArr = img.src.split('/');
        if (srcArr && 0 < srcArr.length) {
            img.name = srcArr[srcArr.length - 1];
        }
        if (1 == contentArr.length) {
            img.alt = img.src;
        }
        else {
            img.alt = '';
            for (let i = 1; i < contentArr.length; i++) {
                if (i == contentArr.length - 1 && /\d+/.test(contentArr[i]))
                    break;
                if (img.alt)
                    img.alt += '|';
                img.alt += contentArr[i];
            }
        }
        img.convert = true;
    }
    return img;
};
const matchImageTag = (text) => {
    let match = text.match(IMG_TAG_LINK_SRC_REGEX); // 3-a-img-src: <a> <img ... src=''/> </a>
    let link = false;
    if (match) {
        link = true;
    }
    else {
        match = text.match(IMG_TAG_SRC_REGEX); // 3-img-src: <img ... src='' />
    }
    if (!match)
        return null;
    const img = new GalleryImgCto();
    img.link = link;
    img.match = match;
    img.src = img.link ? match[2] : match[1];
    if (img.src) {
        if (img.src.startsWith('file://')) {
            img.src = img.src.replace(/^file:\/+/, 'app://local/');
        }
        else if (FULL_PATH_REGEX.test(img.src)) {
            img.src = 'app://local/' + img.src;
        }
    }
    const matchAlt = text.match(IMG_TAG_ALT_REGEX);
    img.alt = matchAlt ? matchAlt[1] : '';
    return img;
};
const md5Img = (alt, src) => {
    return Md5.init((alt ? alt : '') + '_' + src);
};

class GalleryNavbarView {
    constructor(containerView, plugin) {
        // whether to display gallery navbar
        this.state = false;
        this.galleryNavbarEl = null;
        this.galleryListEl = null;
        this.galleryIsMousingDown = false;
        this.galleryMouseDownClientX = 0;
        this.galleryTranslateX = 0;
        this.CACHE_LIMIT = 10;
        this.CLICK_TIME = 150;
        this.renderGalleryImg = (imgFooterEl) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.state)
                return;
            // get all of images on the current editor
            const activeView = this.plugin.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!activeView
                || 'markdown' !== activeView.getViewType()
                // modal-container: community plugin, flashcards (Space Repetition)
                || 0 < document.getElementsByClassName('modal-container').length) {
                if (this.galleryNavbarEl)
                    this.galleryNavbarEl.hidden = true;
                if (this.galleryListEl)
                    this.galleryListEl.innerHTML = '';
                return;
            }
            // <div class="gallery-navbar"> <ul class="gallery-list"> <li> <img src='' alt=''> </li> <li...> <ul> </div>
            this.initGalleryNavbar(imgFooterEl);
            const activeFile = activeView.file;
            let galleryImg = this.getGalleryImgCache(activeFile);
            if (!galleryImg) {
                galleryImg = parseActiveViewData(this.plugin, (_a = activeView.data) === null || _a === void 0 ? void 0 : _a.split('\n'), activeFile);
                this.setGalleryImgCache(galleryImg);
            }
            // console.log('oit-gallery-navbar: ' + (hitCache ? 'hit cache' : 'miss cache') + '!', galleryImg);
            const imgList = galleryImg.galleryImgList;
            const imgContextHash = this.getTargetImgContextHash(this.containerView.targetImgEl, activeView.containerEl, this.plugin.imgSelector);
            let liEl, imgEl, liElActive;
            let targetImageIdx = -1;
            let isAddGalleryActive = false;
            let prevHash, nextHash;
            const viewImageWithALink = this.plugin.settings.viewImageWithALink;
            for (let i = 0, len = imgList.length; i < len; i++) {
                const img = imgList[i];
                if (!viewImageWithALink && img.link)
                    continue;
                // <li> <img class='gallery-img' src='' alt=''> </li>
                this.galleryListEl.append(liEl = createEl('li'));
                liEl.append(imgEl = createEl('img'));
                imgEl.addClass('gallery-img');
                imgEl.setAttr('alt', img.alt);
                imgEl.setAttr('src', img.src);
                // find the target image (which image is just clicked)
                if (!imgContextHash || isAddGalleryActive)
                    continue;
                if (imgContextHash[1] == img.hash) {
                    if (0 > targetImageIdx) {
                        targetImageIdx = i;
                        liElActive = liEl;
                    }
                    if (0 == i) {
                        prevHash = null;
                        nextHash = 1 < len ? imgList[i + 1].hash : null;
                    }
                    else if (len - 1 == i) {
                        prevHash = imgList[i - 1].hash;
                        nextHash = null;
                    }
                    else {
                        prevHash = imgList[i - 1].hash;
                        nextHash = imgList[i + 1].hash;
                    }
                    if (imgContextHash[0] == prevHash && imgContextHash[2] == nextHash) {
                        isAddGalleryActive = true;
                        liElActive = liEl;
                    }
                }
            }
            if (0 <= targetImageIdx) {
                liElActive === null || liElActive === void 0 ? void 0 : liElActive.addClass('gallery-active');
                this.galleryTranslateX = (document.documentElement.clientWidth || document.body.clientWidth) / 2.5 - targetImageIdx * 52;
                this.galleryListEl.style.transform = 'translateX(' + this.galleryTranslateX + 'px)';
            }
        });
        this.initDefaultData = () => {
            this.galleryMouseDownClientX = 0;
            this.galleryTranslateX = 0;
            this.galleryListEl.style.transform = 'translateX(0px)';
            // remove all childs (li) of gallery-list
            this.galleryListEl.innerHTML = '';
        };
        this.initGalleryNavbar = (imgFooterEl) => {
            // <div class="gallery-navbar">
            if (!this.galleryNavbarEl) {
                // imgInfo.imgFooterEl.append(galleryNavbarEl = createDiv());
                imgFooterEl.append(this.galleryNavbarEl = createDiv());
                this.galleryNavbarEl.addClass('gallery-navbar');
                // add events
                this.galleryNavbarEl.addEventListener('mousedown', this.mouseDownGallery);
                this.galleryNavbarEl.addEventListener('mousemove', this.mouseMoveGallery);
                this.galleryNavbarEl.addEventListener('mouseup', this.mouseUpGallery);
                this.galleryNavbarEl.addEventListener('mouseleave', this.mouseLeaveGallery);
            }
            if (!this.galleryListEl) {
                this.galleryNavbarEl.append(this.galleryListEl = createEl('ul')); // <ul class="gallery-list">
                this.galleryListEl.addClass('gallery-list');
            }
            this.initDefaultData();
            this.galleryNavbarEl.hidden = false; // display 'gallery-navbar'
            this.state = true;
        };
        this.closeGalleryNavbar = () => {
            if (!this.state)
                return;
            this.galleryNavbarEl.hidden = true; // hide 'gallery-navbar'
            this.state = false;
            this.initDefaultData();
        };
        this.getTargetImgContextHash = (targetImgEl, containerEl, imageSelector) => {
            let imgEl;
            let targetImgHash = null;
            let targetIdx = -1;
            const imgs = containerEl.querySelectorAll(imageSelector);
            // console.log('IMAGE_SELECTOR>>', imageSelector, imgs);
            const len = imgs.length;
            for (let i = 0; i < len; i++) {
                if (imgEl = imgs[i]) {
                    if ('1' == imgEl.getAttribute('data-oit-target')) {
                        targetIdx = i;
                        targetImgHash = md5Img(imgEl.alt, imgEl.src);
                        break;
                    }
                }
            }
            if (0 > targetIdx)
                targetImgHash = md5Img(targetImgEl.alt, targetImgEl.src);
            let prevHash, nextHash;
            if (0 == targetIdx) {
                prevHash = null;
                nextHash = 1 < len ? md5Img(imgs[1].alt, imgs[1].src) : null;
            }
            else if (len - 1 == targetIdx) {
                prevHash = md5Img(imgs[targetIdx - 1].alt, imgs[targetIdx - 1].src);
                nextHash = null;
            }
            else {
                prevHash = md5Img(imgs[targetIdx - 1].alt, imgs[targetIdx - 1].src);
                nextHash = md5Img(imgs[targetIdx + 1].alt, imgs[targetIdx + 1].src);
            }
            return [prevHash, targetImgHash, nextHash];
        };
        this.clickGalleryImg = (event) => {
            const targetEl = event.target;
            if (!targetEl || 'IMG' !== targetEl.tagName)
                return;
            this.containerView.initDefaultData(targetEl.style);
            this.containerView.refreshImg(targetEl.src, targetEl.alt ? targetEl.alt : ' ');
            // remove the li's class gallery-active
            if (this.galleryListEl) {
                const liElList = this.galleryListEl.getElementsByTagName('li');
                let liEl;
                for (let i = 0, len = liElList.length; i < len; i++) {
                    if ((liEl = liElList[i]) && liEl.hasClass('gallery-active')) {
                        liEl.removeClass('gallery-active');
                    }
                }
            }
            // add class 'gallery-active' for the current clicked image in the gallery-navbar
            const parentliEl = targetEl.parentElement;
            if (parentliEl && 'LI' === parentliEl.tagName) {
                parentliEl.addClass('gallery-active');
            }
        };
        this.mouseDownGallery = (event) => {
            // console.log('mouse Down Gallery...');
            event.preventDefault();
            event.stopPropagation();
            this.mouseDownTime = new Date().getTime();
            this.galleryIsMousingDown = true;
            this.galleryMouseDownClientX = event.clientX;
        };
        this.mouseMoveGallery = (event) => {
            // console.log('mouse Move Gallery...');
            event.preventDefault();
            event.stopPropagation();
            if (!this.galleryIsMousingDown)
                return;
            let moveDistance = event.clientX - this.galleryMouseDownClientX;
            if (4 > Math.abs(moveDistance))
                return;
            this.galleryMouseDownClientX = event.clientX;
            this.galleryTranslateX += moveDistance;
            const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
            const imgLiWidth = (this.galleryListEl.childElementCount - 1) * 52;
            // console.log('move...', 'windowWidth=' + windowWidth, 'galleryTranslateX=' + galleryTranslateX, 'li count=' + imgInfo.galleryList.childElementCount);
            if (this.galleryTranslateX + 50 >= windowWidth)
                this.galleryTranslateX = windowWidth - 50;
            if (0 > this.galleryTranslateX + imgLiWidth)
                this.galleryTranslateX = -imgLiWidth;
            this.galleryListEl.style.transform = 'translateX(' + this.galleryTranslateX + 'px)';
        };
        this.mouseUpGallery = (event) => {
            // console.log('mouse Up Gallery>>>', event.target);
            event.preventDefault();
            event.stopPropagation();
            this.galleryIsMousingDown = false;
            if (!this.mouseDownTime || this.CLICK_TIME > new Date().getTime() - this.mouseDownTime) {
                this.clickGalleryImg(event);
            }
            this.mouseDownTime = null;
        };
        this.mouseLeaveGallery = (event) => {
            // console.log('mouse Leave Gallery>>>', event.target);
            event.preventDefault();
            event.stopPropagation();
            this.galleryIsMousingDown = false;
            this.mouseDownTime = null;
        };
        this.getGalleryImgCache = (file) => {
            if (!file)
                return null;
            const md5File = this.md5File(file.path, file.stat.ctime);
            if (!md5File)
                return null;
            const galleryImgCache = GalleryNavbarView.GALLERY_IMG_CACHE.get(md5File);
            if (galleryImgCache && file.stat.mtime !== galleryImgCache.file.mtime) {
                GalleryNavbarView.GALLERY_IMG_CACHE.delete(md5File);
                return null;
            }
            return galleryImgCache;
        };
        this.setGalleryImgCache = (galleryImg) => {
            const md5File = this.md5File(galleryImg.file.path, galleryImg.file.ctime);
            if (!md5File)
                return;
            this.trimGalleryImgCache();
            GalleryNavbarView.GALLERY_IMG_CACHE.set(md5File, galleryImg);
        };
        this.trimGalleryImgCache = () => {
            if (GalleryNavbarView.GALLERY_IMG_CACHE.size < this.CACHE_LIMIT)
                return;
            let earliestMtime, earliestKey;
            GalleryNavbarView.GALLERY_IMG_CACHE.forEach((value, key) => {
                if (!earliestMtime) {
                    earliestMtime = value.mtime;
                    earliestKey = key;
                }
                else {
                    if (earliestMtime > value.mtime) {
                        earliestMtime = value.mtime;
                        earliestKey = key;
                    }
                }
            });
            if (earliestKey) {
                GalleryNavbarView.GALLERY_IMG_CACHE.delete(earliestKey);
            }
        };
        this.md5File = (path, ctime) => {
            if (!path || !ctime)
                return;
            return Md5.init(path + '_' + ctime);
        };
        this.containerView = containerView;
        this.plugin = plugin;
    }
}
GalleryNavbarView.GALLERY_IMG_CACHE = new Map();

class ContainerView {
    constructor(plugin) {
        this.imgInfo = {
            oitContainerViewEl: null,
            imgViewEl: null,
            imgTitleEl: null,
            imgTipEl: null,
            imgTipTimeout: null,
            imgFooterEl: null,
            imgPlayerEl: null,
            imgPlayerImgViewEl: null,
            galleryNavbar: null,
            galleryList: null,
            curWidth: 0,
            curHeight: 0,
            realWidth: 0,
            realHeight: 0,
            left: 0,
            top: 0,
            moveX: 0,
            moveY: 0,
            rotate: 0,
            invertColor: false,
            scaleX: false,
            scaleY: false,
            fullScreen: false
        };
        this.imgStatus = {
            // whether the image is clicked and displayed on the popup layer
            popup: false,
            dragging: false,
            arrowUp: false,
            arrowDown: false,
            arrowLeft: false,
            arrowRight: false
        };
        this.defaultImgStyles = {
            transform: 'none',
            filter: 'none',
            mixBlendMode: 'normal',
            borderWidth: '',
            borderStyle: '',
            borderColor: ''
        };
        this.renderContainerView = (targetEl) => {
            if (this.imgStatus.popup)
                return;
            this.initContainerView(targetEl, this.plugin.app.workspace.containerEl);
            this.openOitContainerView();
            this.renderGalleryNavbar();
            this.refreshImg(targetEl.src, targetEl.alt);
        };
        this.initContainerView = (targetEl, containerEl) => {
            if (null == this.imgInfo.oitContainerViewEl || !this.imgInfo.oitContainerViewEl) {
                // console.log('initContainerView....', this.imgInfo.containerViewEl);
                // <div class="oit-container-view">
                containerEl.appendChild(this.imgInfo.oitContainerViewEl = createDiv()); // oit-container-view
                this.imgInfo.oitContainerViewEl.addClass('oit-container-view');
                // <div class="img-container"> <img class="img-view" src="" alt=""> </div>
                const imgContainerEl = createDiv();
                imgContainerEl.addClass('img-container');
                imgContainerEl.appendChild(this.imgInfo.imgViewEl = createEl('img')); // img-view
                this.imgInfo.imgViewEl.addClass('img-view');
                this.imgInfo.oitContainerViewEl.appendChild(imgContainerEl);
                // <div class="img-tip"></div>
                this.imgInfo.oitContainerViewEl.appendChild(this.imgInfo.imgTipEl = createDiv()); // img-tip
                this.imgInfo.imgTipEl.addClass('img-tip');
                this.imgInfo.imgTipEl.hidden = true; // hide 'img-tip'
                // <div class="img-footer"> ... <div>
                this.imgInfo.oitContainerViewEl.appendChild(this.imgInfo.imgFooterEl = createDiv()); // img-footer
                this.imgInfo.imgFooterEl.addClass('img-footer');
                // <div class="img-title"></div>
                this.imgInfo.imgFooterEl.appendChild(this.imgInfo.imgTitleEl = createDiv()); // img-title
                this.imgInfo.imgTitleEl.addClass('img-title');
                // <ul class="img-toolbar">
                const imgToolbarUlEL = createEl('ul'); // img-toolbar
                imgToolbarUlEL.addClass('img-toolbar');
                this.imgInfo.imgFooterEl.appendChild(imgToolbarUlEL);
                let toolbarLi;
                for (const toolbar of IMG_TOOLBAR_ICONS) {
                    imgToolbarUlEL.appendChild(toolbarLi = createEl('li'));
                    toolbarLi.addClass(toolbar.class);
                    toolbarLi.setAttribute('alt', toolbar.key);
                    // @ts-ignore
                    toolbarLi.setAttribute('title', t(toolbar.title));
                }
                // add event: for img-toolbar ul
                imgToolbarUlEL.addEventListener('click', this.clickImgToolbar);
                // <div class="img-player"> <img class='img-fullscreen' src=''> </div>
                this.imgInfo.oitContainerViewEl.appendChild(this.imgInfo.imgPlayerEl = createDiv()); // img-player for full screen mode
                this.imgInfo.imgPlayerEl.addClass('img-player');
                this.imgInfo.imgPlayerEl.appendChild(this.imgInfo.imgPlayerImgViewEl = createEl('img'));
                this.imgInfo.imgPlayerImgViewEl.addClass('img-fullscreen');
            }
            this.setTargetImg(targetEl);
            this.initDefaultData(window.getComputedStyle(targetEl));
            this.addOrRemoveEvents(true); // add events
        };
        this.setTargetImg = (targetEl) => {
            var _a;
            this.restoreBorderForLastTargetImg();
            (_a = this.targetImgEl) === null || _a === void 0 ? void 0 : _a.removeAttribute('data-oit-target');
            this.targetImgEl = targetEl;
            this.targetImgEl.setAttribute('data-oit-target', '1');
        };
        this.initDefaultData = (targetImgStyle) => {
            if (targetImgStyle) {
                this.defaultImgStyles.transform = 'none';
                this.defaultImgStyles.filter = targetImgStyle.filter;
                // @ts-ignore
                this.defaultImgStyles.mixBlendMode = targetImgStyle.mixBlendMode;
                this.defaultImgStyles.borderWidth = targetImgStyle.borderWidth;
                this.defaultImgStyles.borderStyle = targetImgStyle.borderStyle;
                this.defaultImgStyles.borderColor = targetImgStyle.borderColor;
            }
            this.realImgInterval = null;
            this.imgStatus.dragging = false;
            this.imgStatus.arrowUp = false;
            this.imgStatus.arrowDown = false;
            this.imgStatus.arrowLeft = false;
            this.imgStatus.arrowRight = false;
            this.imgInfo.invertColor = false;
            this.imgInfo.scaleX = false;
            this.imgInfo.scaleY = false;
            this.imgInfo.fullScreen = false;
        };
        this.openOitContainerView = () => {
            if (!this.imgInfo.oitContainerViewEl) {
                console.error('obsidian-image-toolkit: oit-container-view has not been initialized!');
                return;
            }
            this.imgStatus.popup = true;
            this.imgInfo.oitContainerViewEl.style.setProperty('display', 'block'); // display 'oit-container-view'
        };
        this.closeViewContainer = (event) => {
            if (event) {
                const targetClassName = event.target.className;
                if ('img-container' != targetClassName && 'oit-container-view' != targetClassName)
                    return;
            }
            if (this.imgInfo.oitContainerViewEl) {
                this.addBorderForTargetImg();
                this.imgInfo.oitContainerViewEl.style.setProperty('display', 'none'); // hide 'oit-container-view'
                this.renderImgTitle('');
                this.renderImgView('', '');
                // remove events
                this.addOrRemoveEvents(false);
                this.imgStatus.popup = false;
            }
            if (IMG_GLOBAL_SETTINGS.galleryNavbarToggle && this.galleryNavbarView) {
                this.galleryNavbarView.closeGalleryNavbar();
            }
        };
        this.removeOitContainerView = () => {
            var _a;
            (_a = this.imgInfo.oitContainerViewEl) === null || _a === void 0 ? void 0 : _a.remove();
            this.imgStatus.dragging = false;
            this.imgStatus.popup = false;
            this.imgInfo.oitContainerViewEl = null;
            this.imgInfo.imgViewEl = null;
            this.imgInfo.imgTitleEl = null;
            this.imgInfo.curWidth = 0;
            this.imgInfo.curHeight = 0;
            this.imgInfo.realWidth = 0;
            this.imgInfo.realHeight = 0;
            this.imgInfo.moveX = 0;
            this.imgInfo.moveY = 0;
            this.imgInfo.rotate = 0;
        };
        this.renderGalleryNavbar = () => {
            // <div class="gallery-navbar"> <ul class="gallery-list"> <li> <img src='' alt=''> </li> <li...> <ul> </div>
            if (!this.plugin.settings.galleryNavbarToggle)
                return;
            if (!this.galleryNavbarView) {
                this.galleryNavbarView = new GalleryNavbarView(this, this.plugin);
            }
            this.galleryNavbarView.renderGalleryImg(this.imgInfo.imgFooterEl);
        };
        this.refreshImg = (imgSrc, imgAlt) => {
            const src = imgSrc ? imgSrc : this.imgInfo.imgViewEl.src;
            const alt = imgAlt ? imgAlt : this.imgInfo.imgViewEl.alt;
            this.renderImgTitle(alt);
            if (src) {
                let realImg = new Image();
                realImg.src = src;
                this.realImgInterval = setInterval((img) => {
                    if (img.width > 0 || img.height > 0) {
                        clearInterval(this.realImgInterval);
                        this.realImgInterval = null;
                        this.setImgViewPosition(calculateImgZoomSize(img, this.imgInfo), 0);
                        this.renderImgView(src, alt);
                        this.renderImgTip();
                        this.imgInfo.imgViewEl.style.setProperty('transform', this.defaultImgStyles.transform);
                        this.imgInfo.imgViewEl.style.setProperty('filter', this.defaultImgStyles.filter);
                        this.imgInfo.imgViewEl.style.setProperty('mix-blend-mode', this.defaultImgStyles.mixBlendMode);
                    }
                }, 40, realImg);
            }
        };
        this.renderImgView = (src, alt) => {
            if (!this.imgInfo.imgViewEl)
                return;
            this.imgInfo.imgViewEl.setAttribute('src', src);
            this.imgInfo.imgViewEl.setAttribute('alt', alt);
        };
        this.renderImgTitle = (alt) => {
            var _a;
            (_a = this.imgInfo.imgTitleEl) === null || _a === void 0 ? void 0 : _a.setText(alt);
        };
        this.renderImgTip = () => {
            if (this.imgInfo.realWidth > 0 && this.imgInfo.curWidth > 0) {
                if (this.imgInfo.imgTipTimeout) {
                    clearTimeout(this.imgInfo.imgTipTimeout);
                }
                if (IMG_GLOBAL_SETTINGS.imgTipToggle) {
                    this.imgInfo.imgTipEl.hidden = false; // display 'img-tip'
                    this.imgInfo.imgTipEl.setText(parseInt(this.imgInfo.curWidth * 100 / this.imgInfo.realWidth + '') + '%');
                    this.imgInfo.imgTipTimeout = setTimeout(() => {
                        this.imgInfo.imgTipEl.hidden = true;
                    }, 1000);
                }
                else {
                    this.imgInfo.imgTipEl.hidden = true; // hide 'img-tip'
                    this.imgInfo.imgTipTimeout = null;
                }
            }
        };
        this.setImgViewPosition = (imgZoomSize, rotate) => {
            if (imgZoomSize) {
                this.imgInfo.imgViewEl.setAttribute('width', imgZoomSize.curWidth + 'px');
                this.imgInfo.imgViewEl.style.setProperty('margin-top', imgZoomSize.top + 'px', 'important');
                this.imgInfo.imgViewEl.style.setProperty('margin-left', imgZoomSize.left + 'px', 'important');
            }
            const rotateDeg = rotate ? rotate : 0;
            this.imgInfo.imgViewEl.style.transform = 'rotate(' + rotateDeg + 'deg)';
            this.imgInfo.rotate = rotateDeg;
        };
        this.zoomAndRender = (ratio, event) => {
            let offsetSize = { offsetX: 0, offsetY: 0 };
            if (event) {
                offsetSize.offsetX = event.offsetX;
                offsetSize.offsetY = event.offsetY;
            }
            else {
                offsetSize.offsetX = this.imgInfo.curWidth / 2;
                offsetSize.offsetY = this.imgInfo.curHeight / 2;
            }
            const zoomData = zoom(ratio, this.imgInfo, offsetSize);
            this.renderImgTip();
            this.imgInfo.imgViewEl.setAttribute('width', zoomData.curWidth + 'px');
            this.imgInfo.imgViewEl.style.setProperty('margin-top', zoomData.top + 'px', 'important');
            this.imgInfo.imgViewEl.style.setProperty('margin-left', zoomData.left + 'px', 'important');
        };
        /**
         * full-screen mode
         */
        this.showPlayerImg = () => {
            this.imgInfo.fullScreen = true;
            this.imgInfo.imgViewEl.style.setProperty('display', 'none', 'important'); // hide imgViewEl
            this.imgInfo.imgFooterEl.style.setProperty('display', 'none'); // hide 'img-footer'
            // show the img-player
            this.imgInfo.imgPlayerEl.style.setProperty('display', 'block'); // display 'img-player'
            this.imgInfo.imgPlayerEl.addEventListener('click', this.closePlayerImg);
            const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
            const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let newWidth, newHeight;
            let top = 0;
            if (IMG_FULL_SCREEN_MODE.STRETCH == IMG_GLOBAL_SETTINGS.imgFullScreenMode) {
                newWidth = windowWidth + 'px';
                newHeight = windowHeight + 'px';
            }
            else if (IMG_FULL_SCREEN_MODE.FILL == IMG_GLOBAL_SETTINGS.imgFullScreenMode) {
                newWidth = '100%';
                newHeight = '100%';
            }
            else {
                // fit
                const widthRatio = windowWidth / this.imgInfo.realWidth;
                const heightRatio = windowHeight / this.imgInfo.realHeight;
                if (widthRatio <= heightRatio) {
                    newWidth = windowWidth;
                    newHeight = widthRatio * this.imgInfo.realHeight;
                }
                else {
                    newHeight = windowHeight;
                    newWidth = heightRatio * this.imgInfo.realWidth;
                }
                top = (windowHeight - newHeight) / 2;
                newWidth = newWidth + 'px';
                newHeight = newHeight + 'px';
            }
            this.imgInfo.imgPlayerImgViewEl.setAttribute('src', this.imgInfo.imgViewEl.src);
            this.imgInfo.imgPlayerImgViewEl.setAttribute('alt', this.imgInfo.imgViewEl.alt);
            this.imgInfo.imgPlayerImgViewEl.setAttribute('width', newWidth);
            this.imgInfo.imgPlayerImgViewEl.setAttribute('height', newHeight);
            this.imgInfo.imgPlayerImgViewEl.style.setProperty('margin-top', top + 'px');
            //this.imgInfo.imgPlayerImgViewEl.style.setProperty('margin-left', left + 'px');
        };
        this.closePlayerImg = () => {
            this.imgInfo.fullScreen = false;
            this.imgInfo.imgPlayerEl.style.setProperty('display', 'none'); // hide 'img-player'
            this.imgInfo.imgPlayerEl.removeEventListener('click', this.closePlayerImg);
            this.imgInfo.imgPlayerImgViewEl.setAttribute('src', '');
            this.imgInfo.imgPlayerImgViewEl.setAttribute('alt', '');
            this.imgInfo.imgViewEl.style.setProperty('display', 'block', 'important');
            this.imgInfo.imgFooterEl.style.setProperty('display', 'block');
        };
        this.addOrRemoveEvents = (flag) => {
            if (flag) {
                // close the popup layer (image-toolkit-view-container) via clicking pressing Esc
                document.addEventListener('keyup', this.triggerKeyup);
                document.addEventListener('keydown', this.triggerKeydown);
                this.imgInfo.oitContainerViewEl.addEventListener('click', this.closeViewContainer);
                // drag the image via mouse
                this.imgInfo.imgViewEl.addEventListener('mousedown', this.mousedownImgView);
                // zoom the image via mouse wheel
                this.imgInfo.imgViewEl.addEventListener('mousewheel', this.mousewheelViewContainer, { passive: true });
            }
            else {
                document.removeEventListener('keyup', this.triggerKeyup);
                document.removeEventListener('keydown', this.triggerKeydown);
                this.imgInfo.oitContainerViewEl.removeEventListener('click', this.closeViewContainer);
                this.imgInfo.imgViewEl.removeEventListener('mousedown', this.mousedownImgView);
                this.imgInfo.oitContainerViewEl.removeEventListener('mousewheel', this.mousewheelViewContainer);
                if (this.realImgInterval) {
                    clearInterval(this.realImgInterval);
                    this.realImgInterval = null;
                }
            }
        };
        this.addBorderForTargetImg = () => {
            if (IMG_GLOBAL_SETTINGS.imageBorderToggle && this.targetImgEl) {
                const targetImgStyle = this.targetImgEl.style;
                targetImgStyle.setProperty('border-width', IMG_GLOBAL_SETTINGS.imageBorderWidth);
                targetImgStyle.setProperty('border-style', IMG_GLOBAL_SETTINGS.imageBorderStyle);
                targetImgStyle.setProperty('border-color', IMG_GLOBAL_SETTINGS.imageBorderColor);
            }
        };
        this.restoreBorderForLastTargetImg = () => {
            var _a;
            const targetImgStyle = (_a = this.targetImgEl) === null || _a === void 0 ? void 0 : _a.style;
            if (targetImgStyle) {
                targetImgStyle.setProperty('border-width', this.defaultImgStyles.borderWidth);
                targetImgStyle.setProperty('border-style', this.defaultImgStyles.borderStyle);
                targetImgStyle.setProperty('border-color', this.defaultImgStyles.borderColor);
            }
        };
        this.clickImgToolbar = (event) => {
            const targetElClass = event.target.className;
            switch (targetElClass) {
                case 'toolbar_zoom_im':
                    this.zoomAndRender(0.1);
                    break;
                case 'toolbar_zoom_out':
                    this.zoomAndRender(-0.1);
                    break;
                case 'toolbar_full_screen':
                    this.showPlayerImg();
                    break;
                case 'toolbar_refresh':
                    this.refreshImg();
                    break;
                case 'toolbar_rotate_left':
                    this.imgInfo.rotate -= 90;
                    transform(this.imgInfo);
                    break;
                case 'toolbar_rotate_right':
                    this.imgInfo.rotate += 90;
                    transform(this.imgInfo);
                    break;
                case 'toolbar_scale_x':
                    this.imgInfo.scaleX = !this.imgInfo.scaleX;
                    transform(this.imgInfo);
                    break;
                case 'toolbar_scale_y':
                    this.imgInfo.scaleY = !this.imgInfo.scaleY;
                    transform(this.imgInfo);
                    break;
                case 'toolbar_invert_color':
                    this.imgInfo.invertColor = !this.imgInfo.invertColor;
                    invertImgColor(this.imgInfo.imgViewEl, this.imgInfo.invertColor);
                    break;
                case 'toolbar_copy':
                    copyImage(this.imgInfo.imgViewEl, this.imgInfo.curWidth, this.imgInfo.curHeight);
                    break;
            }
        };
        this.triggerKeyup = (event) => {
            //console.log('keyup', event, event.code);
            event.preventDefault();
            event.stopPropagation();
            switch (event.code) {
                case 'Escape': // Esc
                    this.imgInfo.fullScreen ? this.closePlayerImg() : this.closeViewContainer();
                    break;
                case 'ArrowUp':
                    this.imgStatus.arrowUp = false;
                    break;
                case 'ArrowDown':
                    this.imgStatus.arrowDown = false;
                    break;
                case 'ArrowLeft':
                    this.imgStatus.arrowLeft = false;
                    break;
                case 'ArrowRight':
                    this.imgStatus.arrowRight = false;
                    break;
            }
        };
        this.triggerKeydown = (event) => {
            // console.log('keyup', event, event.code);
            event.preventDefault();
            event.stopPropagation();
            if (this.imgStatus.arrowUp && this.imgStatus.arrowLeft) {
                this.mousemoveImgView(null, { offsetX: -IMG_GLOBAL_SETTINGS.imageMoveSpeed, offsetY: -IMG_GLOBAL_SETTINGS.imageMoveSpeed });
                return;
            }
            else if (this.imgStatus.arrowUp && this.imgStatus.arrowRight) {
                this.mousemoveImgView(null, { offsetX: IMG_GLOBAL_SETTINGS.imageMoveSpeed, offsetY: -IMG_GLOBAL_SETTINGS.imageMoveSpeed });
                return;
            }
            else if (this.imgStatus.arrowDown && this.imgStatus.arrowLeft) {
                this.mousemoveImgView(null, { offsetX: -IMG_GLOBAL_SETTINGS.imageMoveSpeed, offsetY: IMG_GLOBAL_SETTINGS.imageMoveSpeed });
                return;
            }
            else if (this.imgStatus.arrowDown && this.imgStatus.arrowRight) {
                this.mousemoveImgView(null, { offsetX: IMG_GLOBAL_SETTINGS.imageMoveSpeed, offsetY: IMG_GLOBAL_SETTINGS.imageMoveSpeed });
                return;
            }
            switch (event.code) {
                case 'ArrowUp':
                    this.mousemoveImgView(null, { offsetX: 0, offsetY: -IMG_GLOBAL_SETTINGS.imageMoveSpeed });
                    this.imgStatus.arrowUp = true;
                    break;
                case 'ArrowDown':
                    this.mousemoveImgView(null, { offsetX: 0, offsetY: IMG_GLOBAL_SETTINGS.imageMoveSpeed });
                    this.imgStatus.arrowDown = true;
                    break;
                case 'ArrowLeft':
                    this.mousemoveImgView(null, { offsetX: -IMG_GLOBAL_SETTINGS.imageMoveSpeed, offsetY: 0 });
                    this.imgStatus.arrowLeft = true;
                    break;
                case 'ArrowRight':
                    this.mousemoveImgView(null, { offsetX: IMG_GLOBAL_SETTINGS.imageMoveSpeed, offsetY: 0 });
                    this.imgStatus.arrowRight = true;
                    break;
            }
        };
        this.mousedownImgView = (event) => {
            // console.log('mousedownImgView', event);
            event.stopPropagation();
            event.preventDefault();
            this.imgStatus.dragging = true;
            // 鼠标相对于图片的位置
            this.imgInfo.moveX = this.imgInfo.imgViewEl.offsetLeft - event.clientX;
            this.imgInfo.moveY = this.imgInfo.imgViewEl.offsetTop - event.clientY;
            // 鼠标按下时持续触发/移动事件 
            this.imgInfo.oitContainerViewEl.onmousemove = this.mousemoveImgView;
            // 鼠标松开/回弹触发事件
            this.imgInfo.oitContainerViewEl.onmouseup = this.mouseupImgView;
            this.imgInfo.oitContainerViewEl.onmouseleave = this.mouseupImgView;
        };
        this.mousemoveImgView = (event, offsetSize) => {
            if (!this.imgStatus.dragging && !offsetSize)
                return;
            if (event) {
                this.imgInfo.left = event.clientX + this.imgInfo.moveX;
                this.imgInfo.top = event.clientY + this.imgInfo.moveY;
            }
            else if (offsetSize) {
                this.imgInfo.left += offsetSize.offsetX;
                this.imgInfo.top += offsetSize.offsetY;
            }
            else {
                return;
            }
            // 修改图片位置
            this.imgInfo.imgViewEl.style.setProperty('margin-top', this.imgInfo.top + 'px', 'important');
            this.imgInfo.imgViewEl.style.setProperty('margin-left', this.imgInfo.left + 'px', 'important');
        };
        this.mouseupImgView = (event) => {
            // console.log('mouseup...');
            this.imgStatus.dragging = false;
            event.preventDefault();
            event.stopPropagation();
            this.imgInfo.imgViewEl.onmousemove = null;
            this.imgInfo.imgViewEl.onmouseup = null;
        };
        this.mousewheelViewContainer = (event) => {
            // event.preventDefault();
            event.stopPropagation();
            // @ts-ignore
            this.zoomAndRender(0 < event.wheelDelta ? 0.1 : -0.1, event);
        };
        this.plugin = plugin;
    }
}

class ImageToolkitPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.imgSelector = ``;
        this.clickImage = (event) => {
            const targetEl = event.target;
            if (!targetEl || 'IMG' !== targetEl.tagName)
                return;
            this.containerView.renderContainerView(targetEl);
        };
        this.mouseoverImg = (event) => {
            const targetEl = event.target;
            if (!targetEl || 'IMG' !== targetEl.tagName)
                return;
            // console.log('mouseoverImg......');
            const defaultCursor = targetEl.getAttribute('data-oit-default-cursor');
            if (null === defaultCursor) {
                targetEl.setAttribute('data-oit-default-cursor', targetEl.style.cursor || '');
            }
            targetEl.style.cursor = 'zoom-in';
        };
        this.mouseoutImg = (event) => {
            const targetEl = event.target;
            // console.log('mouseoutImg....');
            if (!targetEl || 'IMG' !== targetEl.tagName)
                return;
            targetEl.style.cursor = targetEl.getAttribute('data-oit-default-cursor');
        };
        this.toggleViewImage = () => {
            const viewImageEditor = this.settings.viewImageEditor; // .workspace-leaf-content[data-type='markdown'] img,.workspace-leaf-content[data-type='image'] img
            const viewImageInCPB = this.settings.viewImageInCPB; // .community-plugin-readme img
            const viewImageWithALink = this.settings.viewImageWithALink; // false: ... img:not(a img)
            const viewImageOther = this.settings.viewImageOther; // #sr-flashcard-view img
            if (this.imgSelector) {
                document.off('click', this.imgSelector, this.clickImage);
                document.off('mouseover', this.imgSelector, this.mouseoverImg);
                document.off('mouseout', this.imgSelector, this.mouseoutImg);
            }
            if (!viewImageOther && !viewImageEditor && !viewImageInCPB && !viewImageWithALink) {
                return;
            }
            let selector = ``;
            if (viewImageEditor) {
                selector += (viewImageWithALink ? VIEW_IMG_SELECTOR.EDITOR_AREAS : VIEW_IMG_SELECTOR.EDITOR_AREAS_NO_LINK);
            }
            if (viewImageInCPB) {
                selector += (1 < selector.length ? `,` : ``) + (viewImageWithALink ? VIEW_IMG_SELECTOR.CPB : VIEW_IMG_SELECTOR.CPB_NO_LINK);
            }
            if (viewImageOther) {
                selector += (1 < selector.length ? `,` : ``) + (viewImageWithALink ? VIEW_IMG_SELECTOR.OTHER : VIEW_IMG_SELECTOR.OTHER_NO_LINK);
            }
            if (selector) {
                // console.log('selector: ', selector);
                this.imgSelector = selector;
                document.on('click', this.imgSelector, this.clickImage);
                document.on('mouseover', this.imgSelector, this.mouseoverImg);
                document.on('mouseout', this.imgSelector, this.mouseoutImg);
            }
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading obsidian-image-toolkit plugin...');
            yield this.loadSettings();
            // plugin settings
            this.addSettingTab(new ImageToolkitSettingTab(this.app, this));
            this.containerView = new ContainerView(this);
            this.toggleViewImage();
        });
    }
    onunload() {
        console.log('unloading obsidian-image-toolkit plugin...');
        this.containerView.removeOitContainerView();
        this.containerView = null;
        document.off('click', this.imgSelector, this.clickImage);
        document.off('mouseover', this.imgSelector, this.mouseoverImg);
        document.off('mouseout', this.imgSelector, this.mouseoutImg);
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, IMG_GLOBAL_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = ImageToolkitPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9sYW5nL2xvY2FsZS9hci50cyIsInNyYy9sYW5nL2xvY2FsZS9jei50cyIsInNyYy9sYW5nL2xvY2FsZS9kYS50cyIsInNyYy9sYW5nL2xvY2FsZS9kZS50cyIsInNyYy9sYW5nL2xvY2FsZS9lbi50cyIsInNyYy9sYW5nL2xvY2FsZS9lbi1nYi50cyIsInNyYy9sYW5nL2xvY2FsZS9lcy50cyIsInNyYy9sYW5nL2xvY2FsZS9mci50cyIsInNyYy9sYW5nL2xvY2FsZS9oaS50cyIsInNyYy9sYW5nL2xvY2FsZS9pZC50cyIsInNyYy9sYW5nL2xvY2FsZS9pdC50cyIsInNyYy9sYW5nL2xvY2FsZS9qYS50cyIsInNyYy9sYW5nL2xvY2FsZS9rby50cyIsInNyYy9sYW5nL2xvY2FsZS9ubC50cyIsInNyYy9sYW5nL2xvY2FsZS9uby50cyIsInNyYy9sYW5nL2xvY2FsZS9wbC50cyIsInNyYy9sYW5nL2xvY2FsZS9wdC50cyIsInNyYy9sYW5nL2xvY2FsZS9wdC1ici50cyIsInNyYy9sYW5nL2xvY2FsZS9yby50cyIsInNyYy9sYW5nL2xvY2FsZS9ydS50cyIsInNyYy9sYW5nL2xvY2FsZS90ci50cyIsInNyYy9sYW5nL2xvY2FsZS96aC1jbi50cyIsInNyYy9sYW5nL2xvY2FsZS96aC10dy50cyIsInNyYy9sYW5nL2hlbHBlcnMudHMiLCJzcmMvY29uZi9jb25zdGFudHMudHMiLCJzcmMvY29uZi9zZXR0aW5ncy50cyIsInNyYy91dGlsL2ltZ1V0aWwudHMiLCJub2RlX21vZHVsZXMvbWQ1LXR5cGVzY3JpcHQvZGlzdC9pbmRleC5qcyIsInNyYy90by9GaWxlQ3RvLnRzIiwic3JjL3RvL0dhbGxlcnlJbWdDYWNoZUN0by50cyIsInNyYy90by9HYWxsZXJ5SW1nQ3RvLnRzIiwic3JjL3V0aWwvbWFya2Rvd1BhcnNlLnRzIiwic3JjL3VpL2dhbGxlcnlOYXZiYXJWaWV3LnRzIiwic3JjL3VpL2NvbnRhaW5lclZpZXcudHMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsibW9tZW50IiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJOb3RpY2UiLCJNYXJrZG93blZpZXciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxD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Q0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVGLFFBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELEtBQUssQ0FBQztBQUNOLElBQUksR0FBRyxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtBQUM3QyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUYsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsS0FBSyxDQUFDO0FBQ04sSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0FBQzdDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFD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LEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNuRyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25HLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN0RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNuRyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkcsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxTQUFTO0FBQ1QsUUFBUSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakgsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNsQyxLQUFLLENBQUM7QUFDTixJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDcEIsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNoQixJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQixJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQixJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQixJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNoQixJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqQixJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxVQUFVLEtBQUssTUFBTSxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN2SCxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2hFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDaEUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUN2RCxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzVELElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLEVBQUUsQ0FBQzs7TUNuTVMsT0FBTztJQU9oQixZQUFZLElBQWEsRUFBRSxLQUFjLEVBQUUsS0FBYztRQUNyRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O01DUlEsa0JBQWtCO0lBTzNCLFlBQVksSUFBYyxFQUFFLGNBQXFDLEVBQUUsS0FBYztRQUM3RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O01DZFEsYUFBYTtJQVd0QixZQUFZLEdBQVksRUFBRSxHQUFZO1FBQ2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7S0FDbEI7OztBQ05MOzs7Ozs7Ozs7QUFVTyxNQUFNLG1CQUFtQixHQUFHLENBQUMsTUFBMEIsRUFBRSxLQUFlLEVBQUUsSUFBVztJQUN4RixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQzdDLElBQUksUUFBZ0IsQ0FBQztJQUNyQixJQUFJLFVBQVUsR0FBWSxLQUFLLENBQUM7SUFDaEMsSUFBSSxPQUFzQixDQUFDO0lBQzNCLE1BQU0sT0FBTyxHQUF5QixJQUFJLEtBQUssRUFBaUIsQ0FBQztJQUNqRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlDLElBQUksRUFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUUsU0FBUzs7UUFFckMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQUUsVUFBVSxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQUMsU0FBUztTQUFFO1FBQ3ZFLElBQUksVUFBVTtZQUFFLFNBQVM7UUFDekIsSUFBSSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekMsS0FBSyxNQUFNLElBQUksSUFBSSxPQUFPLEVBQUU7Z0JBQ3hCLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDL0I7U0FDSjthQUFNO1lBQ0gsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuQztLQUNKO0lBQ0QsTUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFDYixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkcsR0FBRyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUMxRTtRQUNELEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxJQUFJLGtCQUFrQixDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzNILENBQUMsQ0FBQTtBQUVELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxRQUFnQjtJQUN6QyxJQUFJLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDM0IsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDMUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxJQUFJLElBQUksS0FBSyxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDL0IsSUFBSSxJQUFJLEdBQUcsQ0FBQztRQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUk7UUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyxDQUFBO0FBR0QsTUFBTSxpQkFBaUIsR0FBRywwQ0FBMEMsQ0FBQztBQUNyRSxNQUFNLFlBQVksR0FBRyxxQkFBcUIsQ0FBQztBQUUzQyxNQUFNLGlCQUFpQixHQUFHLGdFQUFnRSxDQUFDO0FBQzNGLE1BQU0sWUFBWSxHQUFHLDJDQUEyQyxDQUFDO0FBRWpFLE1BQU0sY0FBYyxHQUFHLDBCQUEwQixDQUFDO0FBQ2xELE1BQU0sY0FBYyxHQUFHLDZCQUE2QixDQUFDO0FBRXJELE1BQU0sc0JBQXNCLEdBQUcsa0RBQWtELENBQUM7QUFDbEYsTUFBTSxpQkFBaUIsR0FBRyxvQ0FBb0MsQ0FBQztBQUMvRCxNQUFNLGlCQUFpQixHQUFHLG9DQUFvQyxDQUFDO0FBQy9ELE1BQU0sZUFBZSxHQUFHLHFDQUFxQyxDQUFDO0FBRTlELE1BQU0saUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0FBRXBDLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBWSxFQUFFLE9BQTZCO0lBQzdELElBQUksR0FBa0IsQ0FBQztJQUN2QixJQUFJLEVBQUUsR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQzVCLElBQUksRUFBRSxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxFQUFFLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDOUIsT0FBTzthQUNWO1NBQ0o7S0FDSjtJQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1FBQ1gsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7UUFDakQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxpQkFBaUI7WUFBRSxPQUFPO1FBQ2xELFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzlDO0FBQ0wsQ0FBQyxDQUFBO0FBRUQ7Ozs7O0FBS0EsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZOztJQUM3QixJQUFJLEtBQUssR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVELElBQUksSUFBSSxHQUFZLEtBQUssQ0FBQztJQUMxQixJQUFJLEdBQVcsRUFBRSxHQUFXLENBQUM7SUFDN0IsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7U0FBTTtRQUNILEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLElBQUksS0FBSyxFQUFFO1lBQ1AsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPO2FBQzlEO1lBQ0QsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtLQUNKO0lBQ0QsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN4QixNQUFNLEdBQUcsR0FBa0IsSUFBSSxhQUFhLEVBQUUsQ0FBQztJQUMvQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNsQixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNkLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2QsSUFBSSxLQUFhLENBQUM7SUFDbEIsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ1QsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM5QixJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUMvQixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUMxRDtTQUNKO2FBQU0sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDN0IsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO0tBQ0o7SUFDRCxNQUFNLE1BQU0sR0FBRyxNQUFBLEdBQUcsQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUM3QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDL0MsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRTtLQUNKO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUE7QUFFRDs7Ozs7QUFLQSxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQVk7SUFDN0IsSUFBSSxLQUFLLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1RCxJQUFJLElBQUksR0FBWSxLQUFLLENBQUM7SUFDMUIsSUFBSSxPQUFlLENBQUM7SUFDcEIsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0QjtTQUFNO1FBQ0gsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsT0FBTyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ3JDO0lBQ0QsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN4QixNQUFNLEdBQUcsR0FBa0IsSUFBSSxhQUFhLEVBQUUsQ0FBQztJQUMvQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUVsQixNQUFNLFVBQVUsR0FBRyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksVUFBVSxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbEUsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxNQUFNLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDN0IsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDeEIsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1NBQ3JCO2FBQU07WUFDSCxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFTLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBRSxNQUFNO2dCQUMzRSxJQUFJLEdBQUcsQ0FBQyxHQUFHO29CQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDO2dCQUM1QixHQUFHLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1QjtTQUNKO1FBQ0QsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDdEI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQTtBQUVELE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBWTtJQUMvQixJQUFJLEtBQUssR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2pFLElBQUksSUFBSSxHQUFZLEtBQUssQ0FBQztJQUMxQixJQUFJLEtBQUssRUFBRTtRQUNQLElBQUksR0FBRyxJQUFJLENBQUM7S0FDZjtTQUFNO1FBQ0gsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUN6QztJQUNELElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDeEIsTUFBTSxHQUFHLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7SUFDL0MsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbEIsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ1QsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMvQixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUMxRDthQUFNLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUN0QztLQUNKO0lBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQzlDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdEMsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUE7QUFFTSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUFXO0lBQzNDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNsRCxDQUFDOztNQ2hOWSxpQkFBaUI7SUFvQjFCLFlBQVksYUFBNEIsRUFBRSxNQUEwQjs7UUFmNUQsVUFBSyxHQUFZLEtBQUssQ0FBQztRQUV2QixvQkFBZSxHQUFtQixJQUFJLENBQUM7UUFDdkMsa0JBQWEsR0FBZ0IsSUFBSSxDQUFDO1FBRWxDLHlCQUFvQixHQUFZLEtBQUssQ0FBQztRQUN0Qyw0QkFBdUIsR0FBVyxDQUFDLENBQUM7UUFDcEMsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBS3JCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLGVBQVUsR0FBVyxHQUFHLENBQUM7UUFPbkMscUJBQWdCLEdBQUcsQ0FBTyxXQUF3Qjs7WUFDckQsSUFBSSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPOztZQUV2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNDLHFCQUFZLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsVUFBVTttQkFDUixVQUFVLEtBQUssVUFBVSxDQUFDLFdBQVcsRUFBRTs7bUJBRXZDLENBQUMsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xFLElBQUksSUFBSSxDQUFDLGVBQWU7b0JBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUM3RCxJQUFJLElBQUksQ0FBQyxhQUFhO29CQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFDMUQsT0FBTzthQUNWOztZQUVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVwQyxNQUFNLFVBQVUsR0FBVSxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQzFDLElBQUksVUFBVSxHQUF1QixJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFekUsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFFYixVQUFVLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFBLFVBQVUsQ0FBQyxJQUFJLDBDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDeEYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3ZDOztZQUdELE1BQU0sT0FBTyxHQUF5QixVQUFVLENBQUMsY0FBYyxDQUFDO1lBQ2hFLE1BQU0sY0FBYyxHQUFhLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0ksSUFBSSxJQUFtQixFQUFFLEtBQUssRUFBRSxVQUF5QixDQUFDO1lBQzFELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksa0JBQWtCLEdBQVksS0FBSyxDQUFDO1lBQ3hDLElBQUksUUFBZ0IsRUFBRSxRQUFnQixDQUFDO1lBQ3ZDLE1BQU0sa0JBQWtCLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUM7WUFDNUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsa0JBQWtCLElBQUksR0FBRyxDQUFDLElBQUk7b0JBQUUsU0FBUzs7Z0JBRTlDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnQkFFOUIsSUFBSSxDQUFDLGNBQWMsSUFBSSxrQkFBa0I7b0JBQUUsU0FBUztnQkFDcEQsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtvQkFDL0IsSUFBSSxDQUFDLEdBQUcsY0FBYyxFQUFFO3dCQUNwQixjQUFjLEdBQUcsQ0FBQyxDQUFDO3dCQUNuQixVQUFVLEdBQUcsSUFBSSxDQUFDO3FCQUNyQjtvQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ1IsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDaEIsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO3FCQUNuRDt5QkFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNyQixRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQy9CLFFBQVEsR0FBRyxJQUFJLENBQUM7cUJBQ25CO3lCQUFNO3dCQUNILFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDL0IsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3FCQUNsQztvQkFDRCxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTt3QkFDaEUsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO3dCQUMxQixVQUFVLEdBQUcsSUFBSSxDQUFDO3FCQUNyQjtpQkFDSjthQUNKO1lBQ0QsSUFBSSxDQUFDLElBQUksY0FBYyxFQUFFO2dCQUNyQixVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRXZDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsR0FBRyxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUN6SCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7YUFDdkY7U0FDSixDQUFBLENBQUE7UUFFTyxvQkFBZSxHQUFHO1lBQ3RCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7O1lBRXZELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNyQyxDQUFBO1FBRU8sc0JBQWlCLEdBQUcsQ0FBQyxXQUF3Qjs7WUFFakQsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7O2dCQUV2QixXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Z0JBRWhELElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMxRSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDMUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUMvRTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNyQixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUMvQztZQUNELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDckIsQ0FBQTtRQUVNLHVCQUFrQixHQUFHO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDMUIsQ0FBQTtRQUVPLDRCQUF1QixHQUFHLENBQUMsV0FBNkIsRUFBRSxXQUF3QixFQUFFLGFBQXFCO1lBQzdHLElBQUksS0FBdUIsQ0FBQztZQUM1QixJQUFJLGFBQWEsR0FBVyxJQUFJLENBQUM7WUFDakMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxJQUFJLEdBQWlDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7WUFFdkYsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pCLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsRUFBRTt3QkFDOUMsU0FBUyxHQUFHLENBQUMsQ0FBQzt3QkFDZCxhQUFhLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNO3FCQUNUO2lCQUNKO2FBQ0o7WUFDRCxJQUFJLENBQUMsR0FBRyxTQUFTO2dCQUFFLGFBQWEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUUsSUFBSSxRQUFnQixFQUFFLFFBQWdCLENBQUM7WUFDdkMsSUFBSSxDQUFDLElBQUksU0FBUyxFQUFFO2dCQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ2hFO2lCQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxTQUFTLEVBQUU7Z0JBQzdCLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEUsUUFBUSxHQUFHLElBQUksQ0FBQzthQUNuQjtpQkFBTTtnQkFDSCxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BFLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN2RTtZQUNELE9BQU8sQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzlDLENBQUE7UUFFTyxvQkFBZSxHQUFHLENBQUMsS0FBaUI7WUFDeEMsTUFBTSxRQUFRLEdBQXNCLEtBQUssQ0FBQyxNQUFPLENBQUM7WUFDbEQsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEtBQUssUUFBUSxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUVwRCxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7O1lBRy9FLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDcEIsTUFBTSxRQUFRLEdBQW9DLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hHLElBQUksSUFBbUIsQ0FBQztnQkFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO3dCQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7cUJBQ3RDO2lCQUNKO2FBQ0o7O1lBR0QsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUMxQyxJQUFJLFVBQVUsSUFBSSxJQUFJLEtBQUssVUFBVSxDQUFDLE9BQU8sRUFBRTtnQkFDM0MsVUFBVSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0osQ0FBQTtRQUVPLHFCQUFnQixHQUFHLENBQUMsS0FBaUI7O1lBRXpDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7WUFDakMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7U0FDaEQsQ0FBQTtRQUVPLHFCQUFnQixHQUFHLENBQUMsS0FBaUI7O1lBRXpDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0I7Z0JBQUUsT0FBTztZQUN2QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztZQUNoRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztnQkFBRSxPQUFPO1lBQ3ZDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQzdDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxZQUFZLENBQUM7WUFFdkMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdEYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O1lBRW5FLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsSUFBSSxXQUFXO2dCQUFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQzFGLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVO2dCQUFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUVsRixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7U0FDdkYsQ0FBQTtRQUVPLG1CQUFjLEdBQUcsQ0FBQyxLQUFpQjs7WUFFdkMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNwRixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDN0IsQ0FBQTtRQUVPLHNCQUFpQixHQUFHLENBQUMsS0FBaUI7O1lBRTFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUM3QixDQUFBO1FBRU8sdUJBQWtCLEdBQUcsQ0FBQyxJQUFXO1lBQ3JDLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzFCLE1BQU0sZUFBZSxHQUF1QixpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0YsSUFBSSxlQUFlLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ25FLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEQsT0FBTyxJQUFJLENBQUM7YUFDZjtZQUNELE9BQU8sZUFBZSxDQUFDO1NBQzFCLENBQUE7UUFFTyx1QkFBa0IsR0FBRyxDQUFDLFVBQThCO1lBQ3hELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPO1lBQ3JCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDaEUsQ0FBQTtRQUVPLHdCQUFtQixHQUFHO1lBQzFCLElBQUksaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU87WUFDeEUsSUFBSSxhQUFxQixFQUFFLFdBQW1CLENBQUM7WUFDL0MsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBeUIsRUFBRSxHQUFXO2dCQUMvRSxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUNoQixhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDNUIsV0FBVyxHQUFHLEdBQUcsQ0FBQztpQkFDckI7cUJBQU07b0JBQ0gsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRTt3QkFDN0IsYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQzVCLFdBQVcsR0FBRyxHQUFHLENBQUM7cUJBQ3JCO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsSUFBSSxXQUFXLEVBQUU7Z0JBQ2IsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzNEO1NBQ0osQ0FBQTtRQUVPLFlBQU8sR0FBRyxDQUFDLElBQVksRUFBRSxLQUFhO1lBQzFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU87WUFDNUIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDdkMsQ0FBQTtRQWhRRyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUN4Qjs7QUFSYyxtQ0FBaUIsR0FBRyxJQUFJLEdBQUcsRUFBRTs7TUNibkMsYUFBYTtJQTZEdEIsWUFBWSxNQUEwQjtRQW5EL0IsWUFBTyxHQUFlO1lBQ3pCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsU0FBUyxFQUFFLElBQUk7WUFDZixVQUFVLEVBQUUsSUFBSTtZQUNoQixRQUFRLEVBQUUsSUFBSTtZQUNkLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsYUFBYSxFQUFFLElBQUk7WUFDbkIsV0FBVyxFQUFFLElBQUk7WUFFakIsUUFBUSxFQUFFLENBQUM7WUFDWCxTQUFTLEVBQUUsQ0FBQztZQUNaLFNBQVMsRUFBRSxDQUFDO1lBQ1osVUFBVSxFQUFFLENBQUM7WUFDYixJQUFJLEVBQUUsQ0FBQztZQUNQLEdBQUcsRUFBRSxDQUFDO1lBQ04sS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1lBRVQsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7WUFDYixNQUFNLEVBQUUsS0FBSztZQUViLFVBQVUsRUFBRSxLQUFLO1NBQ3BCLENBQUE7UUFFTyxjQUFTLEdBQWlCOztZQUU5QixLQUFLLEVBQUUsS0FBSztZQUVaLFFBQVEsRUFBRSxLQUFLO1lBRWYsT0FBTyxFQUFFLEtBQUs7WUFDZCxTQUFTLEVBQUUsS0FBSztZQUNoQixTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsS0FBSztTQUNwQixDQUFBO1FBRU8scUJBQWdCLEdBQUc7WUFDdkIsU0FBUyxFQUFFLE1BQU07WUFDakIsTUFBTSxFQUFFLE1BQU07WUFDZCxZQUFZLEVBQUUsUUFBUTtZQUV0QixXQUFXLEVBQUUsRUFBRTtZQUNmLFdBQVcsRUFBRSxFQUFFO1lBQ2YsV0FBVyxFQUFFLEVBQUU7U0FDbEIsQ0FBQTtRQU1NLHdCQUFtQixHQUFHLENBQUMsUUFBMEI7WUFDcEQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUs7Z0JBQUUsT0FBTztZQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9DLENBQUE7UUFFTSxzQkFBaUIsR0FBRyxDQUFDLFFBQTBCLEVBQUUsV0FBd0I7WUFDNUUsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7OztnQkFHN0UsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUE7Z0JBQ3RFLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7O2dCQUcvRCxNQUFNLGNBQWMsR0FBRyxTQUFTLEVBQUUsQ0FBQztnQkFDbkMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDekMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7Z0JBRzVELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pGLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Z0JBR3BDLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7Z0JBRWhELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7O2dCQUU5QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLGNBQWMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDckQsSUFBSSxTQUF3QixDQUFDO2dCQUM3QixLQUFLLE1BQU0sT0FBTyxJQUFJLGlCQUFpQixFQUFFO29CQUNyQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdkQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2xDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7b0JBRTNDLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDckQ7O2dCQUVELGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztnQkFHL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDcEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDeEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzthQUM5RDtZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEMsQ0FBQTtRQUVPLGlCQUFZLEdBQUcsQ0FBQyxRQUEwQjs7WUFDOUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7WUFDckMsTUFBQSxJQUFJLENBQUMsV0FBVywwQ0FBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN6RCxDQUFBO1FBRU0sb0JBQWUsR0FBRyxDQUFDLGNBQW1DO1lBQ3pELElBQUksY0FBYyxFQUFFO2dCQUNoQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztnQkFDekMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDOztnQkFFckQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDO2dCQUVqRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUM7Z0JBQy9ELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQztnQkFDL0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDO2FBQ2xFO1lBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFFNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUVsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDbkMsQ0FBQTtRQUVPLHlCQUFvQixHQUFHO1lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFO2dCQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7Z0JBQ3RGLE9BQU87YUFDVjtZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3pFLENBQUE7UUFFTyx1QkFBa0IsR0FBRyxDQUFDLEtBQWtCO1lBQzVDLElBQUksS0FBSyxFQUFFO2dCQUNQLE1BQU0sZUFBZSxHQUFpQixLQUFLLENBQUMsTUFBTyxDQUFDLFNBQVMsQ0FBQztnQkFDOUQsSUFBSSxlQUFlLElBQUksZUFBZSxJQUFJLG9CQUFvQixJQUFJLGVBQWU7b0JBQUUsT0FBTzthQUM3RjtZQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtnQkFDakMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztnQkFFM0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7YUFDaEM7WUFDRCxJQUFJLG1CQUFtQixDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDbkUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLENBQUM7YUFDL0M7U0FDSixDQUFBO1FBRU0sMkJBQXNCLEdBQUc7O1lBQzVCLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsMENBQUUsTUFBTSxFQUFFLENBQUM7WUFFMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUU3QixJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtZQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUMzQixDQUFBO1FBRU8sd0JBQW1CLEdBQUc7O1lBRTFCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUI7Z0JBQUUsT0FBTztZQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JFO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDckUsQ0FBQTtRQUVNLGVBQVUsR0FBRyxDQUFDLE1BQWUsRUFBRSxNQUFlO1lBQ2pELE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ3pELE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ3pELElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRztvQkFDbkMsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDakMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7d0JBQzVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3ZGLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDakYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQ2xHO2lCQUNKLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ25CO1NBQ0osQ0FBQTtRQUVPLGtCQUFhLEdBQUcsQ0FBQyxHQUFXLEVBQUUsR0FBVztZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUFFLE9BQU87WUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ25ELENBQUE7UUFFTyxtQkFBYyxHQUFHLENBQUMsR0FBVzs7WUFDakMsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsMENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDLENBQUE7UUFFTSxpQkFBWSxHQUFHO1lBQ2xCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtnQkFDekQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtvQkFDNUIsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQzVDO2dCQUNELElBQUksbUJBQW1CLENBQUMsWUFBWSxFQUFFO29CQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDekcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDO3dCQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO3FCQUN2QyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNaO3FCQUFNO29CQUNILElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztpQkFDckM7YUFDSjtTQUNKLENBQUE7UUFFTyx1QkFBa0IsR0FBRyxDQUFDLFdBQXVCLEVBQUUsTUFBZTtZQUNsRSxJQUFJLFdBQVcsRUFBRTtnQkFDYixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQzFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQzthQUNqRztZQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDeEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1NBQ25DLENBQUE7UUFFTyxrQkFBYSxHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWtCO1lBQ3RELElBQUksVUFBVSxHQUFrQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzNELElBQUksS0FBSyxFQUFFO2dCQUNQLFVBQVUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDbkMsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNILFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQzthQUNuRDtZQUNELE1BQU0sUUFBUSxHQUFlLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQzlGLENBQUE7Ozs7UUFLTyxrQkFBYSxHQUFHO1lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7O1lBRTlELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFeEUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdEYsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDekYsSUFBSSxRQUFRLEVBQUUsU0FBUyxDQUFDO2dCQUNwQixHQUFHLEdBQUcsQ0FBQyxDQUFXO1lBQ3RCLElBQUksb0JBQW9CLENBQUMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFO2dCQUN2RSxRQUFRLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDOUIsU0FBUyxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUM7YUFDbkM7aUJBQU0sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLElBQUksbUJBQW1CLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzNFLFFBQVEsR0FBRyxNQUFNLENBQUM7Z0JBQ2xCLFNBQVMsR0FBRyxNQUFNLENBQUM7YUFDdEI7aUJBQU07O2dCQUVILE1BQU0sVUFBVSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDeEQsTUFBTSxXQUFXLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO2dCQUMzRCxJQUFJLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQzNCLFFBQVEsR0FBRyxXQUFXLENBQUM7b0JBQ3ZCLFNBQVMsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7aUJBQ3BEO3FCQUFNO29CQUNILFNBQVMsR0FBRyxZQUFZLENBQUM7b0JBQ3pCLFFBQVEsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7aUJBQ25EO2dCQUNELEdBQUcsR0FBRyxDQUFDLFlBQVksR0FBRyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUVyQyxRQUFRLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDM0IsU0FBUyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUM7YUFDaEM7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hGLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7O1NBRS9FLENBQUE7UUFFTyxtQkFBYyxHQUFHO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTNFLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2xFLENBQUE7UUFFTyxzQkFBaUIsR0FBRyxDQUFDLElBQWE7WUFDdEMsSUFBSSxJQUFJLEVBQUU7O2dCQUVOLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN0RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7O2dCQUVuRixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O2dCQUU1RSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7YUFDMUc7aUJBQU07Z0JBQ0gsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3pELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDaEcsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUNwQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztpQkFDL0I7YUFDSjtTQUNKLENBQUE7UUFFTywwQkFBcUIsR0FBRztZQUM1QixJQUFJLG1CQUFtQixDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQzNELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO2dCQUM5QyxjQUFjLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNqRixjQUFjLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNqRixjQUFjLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ3BGO1NBQ0osQ0FBQTtRQUVPLGtDQUE2QixHQUFHOztZQUNwQyxNQUFNLGNBQWMsR0FBRyxNQUFBLElBQUksQ0FBQyxXQUFXLDBDQUFFLEtBQUssQ0FBQztZQUMvQyxJQUFJLGNBQWMsRUFBRTtnQkFDaEIsY0FBYyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5RSxjQUFjLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzlFLGNBQWMsQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNqRjtTQUNKLENBQUE7UUFFTyxvQkFBZSxHQUFHLENBQUMsS0FBaUI7WUFDeEMsTUFBTSxhQUFhLEdBQWlCLEtBQUssQ0FBQyxNQUFPLENBQUMsU0FBUyxDQUFDO1lBQzVELFFBQVEsYUFBYTtnQkFDakIsS0FBSyxpQkFBaUI7b0JBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLE1BQU07Z0JBQ1YsS0FBSyxrQkFBa0I7b0JBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsTUFBTTtnQkFDVixLQUFLLHFCQUFxQjtvQkFDdEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixNQUFNO2dCQUNWLEtBQUssaUJBQWlCO29CQUNsQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1YsS0FBSyxxQkFBcUI7b0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztvQkFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDeEIsTUFBTTtnQkFDVixLQUFLLHNCQUFzQjtvQkFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO29CQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN4QixNQUFNO2dCQUNWLEtBQUssaUJBQWlCO29CQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO29CQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN4QixNQUFNO2dCQUNWLEtBQUssaUJBQWlCO29CQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO29CQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN4QixNQUFNO2dCQUNWLEtBQUssc0JBQXNCO29CQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO29CQUNyRCxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDakUsTUFBTTtnQkFDVixLQUFLLGNBQWM7b0JBQ2YsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pGLE1BQU07YUFHYjtTQUNKLENBQUE7UUFFTyxpQkFBWSxHQUFHLENBQUMsS0FBb0I7O1lBRXhDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsUUFBUSxLQUFLLENBQUMsSUFBSTtnQkFDZCxLQUFLLFFBQVE7b0JBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUM1RSxNQUFNO2dCQUNWLEtBQUssU0FBUztvQkFDVixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQy9CLE1BQU07Z0JBQ1YsS0FBSyxXQUFXO29CQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDakMsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO29CQUNqQyxNQUFNO2dCQUNWLEtBQUssWUFBWTtvQkFDYixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7b0JBQ2xDLE1BQU07YUFHYjtTQUNKLENBQUE7UUFFTyxtQkFBYyxHQUFHLENBQUMsS0FBb0I7O1lBRTFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO2dCQUM1SCxPQUFPO2FBQ1Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtnQkFDNUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDM0gsT0FBTzthQUNWO2lCQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzdELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE9BQU87YUFDVjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO2dCQUM5RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDMUgsT0FBTzthQUNWO1lBQ0QsUUFBUSxLQUFLLENBQUMsSUFBSTtnQkFDZCxLQUFLLFNBQVM7b0JBQ1YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztvQkFDMUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUM5QixNQUFNO2dCQUNWLEtBQUssV0FBVztvQkFDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztvQkFDekYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNoQyxNQUFNO2dCQUNWLEtBQUssV0FBVztvQkFDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMxRixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2hDLE1BQU07Z0JBQ1YsS0FBSyxZQUFZO29CQUNiLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6RixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQ2pDLE1BQU07YUFHYjtTQUNKLENBQUE7UUFFTyxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCOztZQUV6QyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7WUFFL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDdkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7O1lBRXRFLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzs7WUFFcEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3RFLENBQUE7UUFFTyxxQkFBZ0IsR0FBRyxDQUFDLEtBQWlCLEVBQUUsVUFBMEI7WUFDckUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLENBQUMsVUFBVTtnQkFBRSxPQUFPO1lBQ3BELElBQUksS0FBSyxFQUFFO2dCQUNQLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7YUFDekQ7aUJBQU0sSUFBSSxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUM7YUFDMUM7aUJBQU07Z0JBQ0gsT0FBTzthQUNWOztZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDbEcsQ0FBQTtRQUVPLG1CQUFjLEdBQUcsQ0FBQyxLQUFpQjs7WUFFdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQzNDLENBQUE7UUFFTyw0QkFBdUIsR0FBRyxDQUFDLEtBQWlCOztZQUVoRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7O1lBRXhCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hFLENBQUE7UUE3ZEcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDeEI7OztNQ25FZ0Isa0JBQW1CLFNBQVFDLGVBQU07SUFBdEQ7O1FBTVEsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFnQ3hCLGVBQVUsR0FBRyxDQUFDLEtBQWlCO1lBQ3RDLE1BQU0sUUFBUSxHQUFzQixLQUFLLENBQUMsTUFBTyxDQUFDO1lBQ2xELElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxLQUFLLFFBQVEsQ0FBQyxPQUFPO2dCQUFFLE9BQU87WUFDcEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRU8saUJBQVksR0FBRyxDQUFDLEtBQWlCO1lBQ3hDLE1BQU0sUUFBUSxHQUFzQixLQUFLLENBQUMsTUFBTyxDQUFDO1lBQ2xELElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxLQUFLLFFBQVEsQ0FBQyxPQUFPO2dCQUFFLE9BQU87O1lBRXBELE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN2RSxJQUFJLElBQUksS0FBSyxhQUFhLEVBQUU7Z0JBQzNCLFFBQVEsQ0FBQyxZQUFZLENBQUMseUJBQXlCLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7YUFDOUU7WUFDRCxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDbEMsQ0FBQTtRQUVPLGdCQUFXLEdBQUcsQ0FBQyxLQUFpQjtZQUN2QyxNQUFNLFFBQVEsR0FBc0IsS0FBSyxDQUFDLE1BQU8sQ0FBQzs7WUFFbEQsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEtBQUssUUFBUSxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUNwRCxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDekUsQ0FBQTtRQUVNLG9CQUFlLEdBQUc7WUFDeEIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFDdEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDcEQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO1lBQzVELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBRXBELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDckIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3pELFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMvRCxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUM3RDtZQUNELElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDbEYsT0FBTzthQUNQO1lBQ0QsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBZSxFQUFFO2dCQUNwQixRQUFRLEtBQUssa0JBQWtCLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLENBQUM7YUFDM0c7WUFDRCxJQUFJLGNBQWMsRUFBRTtnQkFDbkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUUsS0FBSyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDNUg7WUFDRCxJQUFJLGNBQWMsRUFBRTtnQkFDbkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUUsS0FBSyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDaEk7WUFFRCxJQUFJLFFBQVEsRUFBRTs7Z0JBRWIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7Z0JBQzVCLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4RCxRQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDOUQsUUFBUSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDNUQ7U0FDRCxDQUFBO0tBRUQ7SUF4Rk0sTUFBTTs7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFFeEQsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7O1lBRzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDdkI7S0FBQTtJQUVELFFBQVE7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9ELFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzdEO0lBRUssWUFBWTs7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzlFO0tBQUE7SUFFSyxZQUFZOztZQUNqQixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO0tBQUE7Ozs7OyJ9
