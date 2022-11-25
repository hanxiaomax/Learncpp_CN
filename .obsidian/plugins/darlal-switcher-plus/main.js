'use strict';

var obsidian = require('obsidian');

var PathDisplayFormat;
(function (PathDisplayFormat) {
    PathDisplayFormat[PathDisplayFormat["None"] = 0] = "None";
    PathDisplayFormat[PathDisplayFormat["Full"] = 1] = "Full";
    PathDisplayFormat[PathDisplayFormat["FolderOnly"] = 2] = "FolderOnly";
    PathDisplayFormat[PathDisplayFormat["FolderWithFilename"] = 3] = "FolderWithFilename";
    PathDisplayFormat[PathDisplayFormat["FolderPathFilenameOptional"] = 4] = "FolderPathFilenameOptional";
})(PathDisplayFormat || (PathDisplayFormat = {}));
var Mode;
(function (Mode) {
    Mode[Mode["Standard"] = 1] = "Standard";
    Mode[Mode["EditorList"] = 2] = "EditorList";
    Mode[Mode["SymbolList"] = 4] = "SymbolList";
    Mode[Mode["WorkspaceList"] = 8] = "WorkspaceList";
    Mode[Mode["HeadingsList"] = 16] = "HeadingsList";
    Mode[Mode["StarredList"] = 32] = "StarredList";
    Mode[Mode["CommandList"] = 64] = "CommandList";
    Mode[Mode["RelatedItemsList"] = 128] = "RelatedItemsList";
})(Mode || (Mode = {}));
var SymbolType;
(function (SymbolType) {
    SymbolType[SymbolType["Link"] = 1] = "Link";
    SymbolType[SymbolType["Embed"] = 2] = "Embed";
    SymbolType[SymbolType["Tag"] = 4] = "Tag";
    SymbolType[SymbolType["Heading"] = 8] = "Heading";
    SymbolType[SymbolType["Callout"] = 16] = "Callout";
})(SymbolType || (SymbolType = {}));
var LinkType;
(function (LinkType) {
    LinkType[LinkType["None"] = 0] = "None";
    LinkType[LinkType["Normal"] = 1] = "Normal";
    LinkType[LinkType["Heading"] = 2] = "Heading";
    LinkType[LinkType["Block"] = 4] = "Block";
})(LinkType || (LinkType = {}));
const SymbolIndicators = {};
SymbolIndicators[SymbolType.Link] = '🔗';
SymbolIndicators[SymbolType.Embed] = '!';
SymbolIndicators[SymbolType.Tag] = '#';
SymbolIndicators[SymbolType.Heading] = 'H';
const HeadingIndicators = {};
HeadingIndicators[1] = 'H₁';
HeadingIndicators[2] = 'H₂';
HeadingIndicators[3] = 'H₃';
HeadingIndicators[4] = 'H₄';
HeadingIndicators[5] = 'H₅';
HeadingIndicators[6] = 'H₆';
var SuggestionType;
(function (SuggestionType) {
    SuggestionType["EditorList"] = "editorList";
    SuggestionType["SymbolList"] = "symbolList";
    SuggestionType["WorkspaceList"] = "workspaceList";
    SuggestionType["HeadingsList"] = "headingsList";
    SuggestionType["StarredList"] = "starredList";
    SuggestionType["CommandList"] = "commandList";
    SuggestionType["RelatedItemsList"] = "relatedItemsList";
    SuggestionType["File"] = "file";
    SuggestionType["Alias"] = "alias";
    SuggestionType["Unresolved"] = "unresolved";
})(SuggestionType || (SuggestionType = {}));
var MatchType;
(function (MatchType) {
    MatchType[MatchType["None"] = 0] = "None";
    MatchType[MatchType["Primary"] = 1] = "Primary";
    MatchType[MatchType["Basename"] = 2] = "Basename";
    MatchType[MatchType["Path"] = 3] = "Path";
})(MatchType || (MatchType = {}));
var RelationType;
(function (RelationType) {
    RelationType["DiskLocation"] = "disk-location";
    RelationType["Backlink"] = "backlink";
})(RelationType || (RelationType = {}));

function isOfType(obj, discriminator, val) {
    let ret = false;
    if (obj && obj[discriminator] !== undefined) {
        ret = true;
        if (val !== undefined && val !== obj[discriminator]) {
            ret = false;
        }
    }
    return ret;
}
function isSymbolSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.SymbolList);
}
function isEditorSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.EditorList);
}
function isWorkspaceSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.WorkspaceList);
}
function isHeadingSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.HeadingsList);
}
function isCommandSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.CommandList);
}
function isFileSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.File);
}
function isAliasSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.Alias);
}
function isUnresolvedSuggestion(obj) {
    return isOfType(obj, 'type', SuggestionType.Unresolved);
}
function isSystemSuggestion(obj) {
    return isFileSuggestion(obj) || isUnresolvedSuggestion(obj) || isAliasSuggestion(obj);
}
function isExSuggestion(sugg) {
    return sugg && !isSystemSuggestion(sugg);
}
function isHeadingCache(obj) {
    return isOfType(obj, 'level');
}
function isTagCache(obj) {
    return isOfType(obj, 'tag');
}
function isCalloutCache(obj) {
    return isOfType(obj, 'type', 'callout');
}
function isTFile(obj) {
    return isOfType(obj, 'extension');
}
function isFileStarredItem(obj) {
    return isOfType(obj, 'type', 'file');
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function getInternalPluginById(app, id) {
    return app?.internalPlugins?.getPluginById(id);
}
function getSystemSwitcherInstance(app) {
    const plugin = getInternalPluginById(app, 'switcher');
    return plugin?.instance;
}
function stripMDExtensionFromPath(file) {
    let retVal = null;
    if (file) {
        const { path } = file;
        retVal = path;
        if (file.extension === 'md') {
            const index = path.lastIndexOf('.');
            if (index !== -1 && index !== path.length - 1 && index !== 0) {
                retVal = path.slice(0, index);
            }
        }
    }
    return retVal;
}
function filenameFromPath(path) {
    let retVal = null;
    if (path) {
        const index = path.lastIndexOf('/');
        retVal = index === -1 ? path : path.slice(index + 1);
    }
    return retVal;
}
function matcherFnForRegExList(regExStrings) {
    regExStrings = regExStrings ?? [];
    const regExList = [];
    for (const str of regExStrings) {
        try {
            const rx = new RegExp(str);
            regExList.push(rx);
        }
        catch (err) {
            console.log(`Switcher++: error creating RegExp from string: ${str}`, err);
        }
    }
    const isMatchFn = (input) => {
        for (const rx of regExList) {
            if (rx.test(input)) {
                return true;
            }
        }
        return false;
    };
    return isMatchFn;
}
function getLinkType(linkCache) {
    let type = LinkType.None;
    if (linkCache) {
        // remove the display text before trying to parse the link target
        const linkStr = linkCache.link.split('|')[0];
        if (linkStr.includes('#^')) {
            type = LinkType.Block;
        }
        else if (linkStr.includes('#')) {
            type = LinkType.Heading;
        }
        else {
            type = LinkType.Normal;
        }
    }
    return type;
}

class FrontMatterParser {
    static getAliases(frontMatter) {
        let aliases = [];
        if (frontMatter) {
            aliases = FrontMatterParser.getValueForKey(frontMatter, /^alias(es)?$/i);
        }
        return aliases;
    }
    static getValueForKey(frontMatter, keyPattern) {
        const retVal = [];
        const fmKeys = Object.keys(frontMatter);
        const key = fmKeys.find((val) => keyPattern.test(val));
        if (key) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let value = frontMatter[key];
            if (typeof value === 'string') {
                value = value.split(',');
            }
            if (Array.isArray(value)) {
                value.forEach((val) => {
                    if (typeof val === 'string') {
                        retVal.push(val.trim());
                    }
                });
            }
        }
        return retVal;
    }
}

class SwitcherPlusSettings {
    constructor(plugin) {
        this.plugin = plugin;
        this.data = SwitcherPlusSettings.defaults;
    }
    static get defaults() {
        const enabledSymbolTypes = {};
        enabledSymbolTypes[SymbolType.Link] = true;
        enabledSymbolTypes[SymbolType.Embed] = true;
        enabledSymbolTypes[SymbolType.Tag] = true;
        enabledSymbolTypes[SymbolType.Heading] = true;
        enabledSymbolTypes[SymbolType.Callout] = true;
        return {
            onOpenPreferNewTab: true,
            alwaysNewTabForSymbols: false,
            useActiveTabForSymbolsOnMobile: false,
            symbolsInLineOrder: true,
            editorListCommand: 'edt ',
            symbolListCommand: '@',
            workspaceListCommand: '+',
            headingsListCommand: '#',
            starredListCommand: "'",
            commandListCommand: '>',
            relatedItemsListCommand: '~',
            strictHeadingsOnly: false,
            searchAllHeadings: true,
            excludeViewTypes: ['empty'],
            referenceViews: ['backlink', 'localgraph', 'outgoing-link', 'outline'],
            limit: 50,
            includeSidePanelViewTypes: ['backlink', 'image', 'markdown', 'pdf'],
            enabledSymbolTypes,
            selectNearestHeading: true,
            excludeFolders: [],
            excludeLinkSubTypes: 0,
            excludeRelatedFolders: [''],
            excludeOpenRelatedFiles: false,
            excludeObsidianIgnoredFiles: false,
            shouldSearchFilenames: false,
            pathDisplayFormat: PathDisplayFormat.FolderWithFilename,
            hidePathIfRoot: true,
            enabledRelatedItems: Object.values(RelationType),
            overrideStandardModeBehaviors: true,
        };
    }
    get builtInSystemOptions() {
        return getSystemSwitcherInstance(this.plugin.app)?.options;
    }
    get showAllFileTypes() {
        // forward to core switcher settings
        return this.builtInSystemOptions?.showAllFileTypes;
    }
    get showAttachments() {
        // forward to core switcher settings
        return this.builtInSystemOptions?.showAttachments;
    }
    get showExistingOnly() {
        // forward to core switcher settings
        return this.builtInSystemOptions?.showExistingOnly;
    }
    get onOpenPreferNewTab() {
        return this.data.onOpenPreferNewTab;
    }
    set onOpenPreferNewTab(value) {
        this.data.onOpenPreferNewTab = value;
    }
    get alwaysNewTabForSymbols() {
        return this.data.alwaysNewTabForSymbols;
    }
    set alwaysNewTabForSymbols(value) {
        this.data.alwaysNewTabForSymbols = value;
    }
    get useActiveTabForSymbolsOnMobile() {
        return this.data.useActiveTabForSymbolsOnMobile;
    }
    set useActiveTabForSymbolsOnMobile(value) {
        this.data.useActiveTabForSymbolsOnMobile = value;
    }
    get symbolsInLineOrder() {
        return this.data.symbolsInLineOrder;
    }
    set symbolsInLineOrder(value) {
        this.data.symbolsInLineOrder = value;
    }
    get editorListPlaceholderText() {
        return SwitcherPlusSettings.defaults.editorListCommand;
    }
    get editorListCommand() {
        return this.data.editorListCommand;
    }
    set editorListCommand(value) {
        this.data.editorListCommand = value;
    }
    get symbolListPlaceholderText() {
        return SwitcherPlusSettings.defaults.symbolListCommand;
    }
    get symbolListCommand() {
        return this.data.symbolListCommand;
    }
    set symbolListCommand(value) {
        this.data.symbolListCommand = value;
    }
    get workspaceListCommand() {
        return this.data.workspaceListCommand;
    }
    set workspaceListCommand(value) {
        this.data.workspaceListCommand = value;
    }
    get workspaceListPlaceholderText() {
        return SwitcherPlusSettings.defaults.workspaceListCommand;
    }
    get headingsListCommand() {
        return this.data.headingsListCommand;
    }
    set headingsListCommand(value) {
        this.data.headingsListCommand = value;
    }
    get headingsListPlaceholderText() {
        return SwitcherPlusSettings.defaults.headingsListCommand;
    }
    get starredListCommand() {
        return this.data.starredListCommand;
    }
    set starredListCommand(value) {
        this.data.starredListCommand = value;
    }
    get starredListPlaceholderText() {
        return SwitcherPlusSettings.defaults.starredListCommand;
    }
    get commandListCommand() {
        return this.data.commandListCommand;
    }
    set commandListCommand(value) {
        this.data.commandListCommand = value;
    }
    get commandListPlaceholderText() {
        return SwitcherPlusSettings.defaults.commandListCommand;
    }
    get relatedItemsListCommand() {
        return this.data.relatedItemsListCommand;
    }
    set relatedItemsListCommand(value) {
        this.data.relatedItemsListCommand = value;
    }
    get relatedItemsListPlaceholderText() {
        return SwitcherPlusSettings.defaults.relatedItemsListCommand;
    }
    get strictHeadingsOnly() {
        return this.data.strictHeadingsOnly;
    }
    set strictHeadingsOnly(value) {
        this.data.strictHeadingsOnly = value;
    }
    get searchAllHeadings() {
        return this.data.searchAllHeadings;
    }
    set searchAllHeadings(value) {
        this.data.searchAllHeadings = value;
    }
    get excludeViewTypes() {
        return this.data.excludeViewTypes;
    }
    get referenceViews() {
        return this.data.referenceViews;
    }
    get limit() {
        return this.data.limit;
    }
    set limit(value) {
        this.data.limit = value;
    }
    get includeSidePanelViewTypes() {
        return this.data.includeSidePanelViewTypes;
    }
    set includeSidePanelViewTypes(value) {
        // remove any duplicates before storing
        this.data.includeSidePanelViewTypes = [...new Set(value)];
    }
    get includeSidePanelViewTypesPlaceholder() {
        return SwitcherPlusSettings.defaults.includeSidePanelViewTypes.join('\n');
    }
    get selectNearestHeading() {
        return this.data.selectNearestHeading;
    }
    set selectNearestHeading(value) {
        this.data.selectNearestHeading = value;
    }
    get excludeFolders() {
        return this.data.excludeFolders;
    }
    set excludeFolders(value) {
        // remove any duplicates before storing
        this.data.excludeFolders = [...new Set(value)];
    }
    get excludeLinkSubTypes() {
        return this.data.excludeLinkSubTypes;
    }
    set excludeLinkSubTypes(value) {
        this.data.excludeLinkSubTypes = value;
    }
    get excludeRelatedFolders() {
        return this.data.excludeRelatedFolders;
    }
    set excludeRelatedFolders(value) {
        this.data.excludeRelatedFolders = [...new Set(value)];
    }
    get excludeOpenRelatedFiles() {
        return this.data.excludeOpenRelatedFiles;
    }
    set excludeOpenRelatedFiles(value) {
        this.data.excludeOpenRelatedFiles = value;
    }
    get excludeObsidianIgnoredFiles() {
        return this.data.excludeObsidianIgnoredFiles;
    }
    set excludeObsidianIgnoredFiles(value) {
        this.data.excludeObsidianIgnoredFiles = value;
    }
    get shouldSearchFilenames() {
        return this.data.shouldSearchFilenames;
    }
    set shouldSearchFilenames(value) {
        this.data.shouldSearchFilenames = value;
    }
    get pathDisplayFormat() {
        return this.data.pathDisplayFormat;
    }
    set pathDisplayFormat(value) {
        this.data.pathDisplayFormat = value;
    }
    get hidePathIfRoot() {
        return this.data.hidePathIfRoot;
    }
    set hidePathIfRoot(value) {
        this.data.hidePathIfRoot = value;
    }
    get enabledRelatedItems() {
        return this.data.enabledRelatedItems;
    }
    set enabledRelatedItems(value) {
        this.data.enabledRelatedItems = value;
    }
    get overrideStandardModeBehaviors() {
        return this.data.overrideStandardModeBehaviors;
    }
    set overrideStandardModeBehaviors(value) {
        this.data.overrideStandardModeBehaviors = value;
    }
    async loadSettings() {
        const copy = (source, target, keys) => {
            for (const key of keys) {
                if (key in source) {
                    target[key] = source[key];
                }
            }
        };
        try {
            const savedData = (await this.plugin?.loadData());
            if (savedData) {
                const keys = Object.keys(SwitcherPlusSettings.defaults);
                copy(savedData, this.data, keys);
            }
        }
        catch (err) {
            console.log('Switcher++: error loading settings, using defaults. ', err);
        }
    }
    async saveSettings() {
        const { plugin, data } = this;
        await plugin?.saveData(data);
    }
    save() {
        this.saveSettings().catch((e) => {
            console.log('Switcher++: error saving changes to settings', e);
        });
    }
    isSymbolTypeEnabled(symbol) {
        const { enabledSymbolTypes } = this.data;
        let value = SwitcherPlusSettings.defaults.enabledSymbolTypes[symbol];
        if (Object.prototype.hasOwnProperty.call(enabledSymbolTypes, symbol)) {
            value = enabledSymbolTypes[symbol];
        }
        return value;
    }
    setSymbolTypeEnabled(symbol, isEnabled) {
        this.data.enabledSymbolTypes[symbol] = isEnabled;
    }
}

class SettingsTabSection {
    constructor(app, mainSettingsTab, config) {
        this.app = app;
        this.mainSettingsTab = mainSettingsTab;
        this.config = config;
    }
    /**
     * Creates a new Setting with the given name and description.
     * @param  {HTMLElement} containerEl
     * @param  {string} name
     * @param  {string} desc
     * @returns Setting
     */
    createSetting(containerEl, name, desc) {
        const setting = new obsidian.Setting(containerEl);
        setting.setName(name);
        setting.setDesc(desc);
        return setting;
    }
    /**
     * Create section title elements and divider.
     * @param  {HTMLElement} containerEl
     * @param  {string} title
     * @param  {string} desc?
     * @returns Setting
     */
    addSectionTitle(containerEl, title, desc = '') {
        const setting = this.createSetting(containerEl, title, desc);
        setting.setHeading();
        return setting;
    }
    /**
     * Creates a HTMLInput element setting.
     * @param  {HTMLElement} containerEl The element to attach the setting to.
     * @param  {string} name
     * @param  {string} desc
     * @param  {string} initialValue
     * @param  {StringTypedConfigKey} configStorageKey The SwitcherPlusSettings key where the value for this setting should be stored.
     * @param  {string} placeholderText?
     * @returns Setting
     */
    addTextSetting(containerEl, name, desc, initialValue, configStorageKey, placeholderText) {
        const setting = this.createSetting(containerEl, name, desc);
        setting.addText((comp) => {
            comp.setPlaceholder(placeholderText);
            comp.setValue(initialValue);
            comp.onChange((rawValue) => {
                const value = rawValue.length ? rawValue : initialValue;
                this.saveChangesToConfig(configStorageKey, value);
            });
        });
        return setting;
    }
    /**
     * Create a Checkbox element setting.
     * @param  {HTMLElement} containerEl The element to attach the setting to.
     * @param  {string} name
     * @param  {string} desc
     * @param  {boolean} initialValue
     * @param  {BooleanTypedConfigKey} configStorageKey The SwitcherPlusSettings key where the value for this setting should be stored. This can safely be set to null if the onChange handler is provided.
     * @param  {(value:string,config:SwitcherPlusSettings)=>void} onChange? optional callback to invoke instead of using configStorageKey
     * @returns Setting
     */
    addToggleSetting(containerEl, name, desc, initialValue, configStorageKey, onChange) {
        const setting = this.createSetting(containerEl, name, desc);
        setting.addToggle((comp) => {
            comp.setValue(initialValue);
            comp.onChange((value) => {
                if (onChange) {
                    onChange(value, this.config);
                }
                else {
                    this.saveChangesToConfig(configStorageKey, value);
                }
            });
        });
        return setting;
    }
    /**
     * Create a TextArea element setting.
     * @param  {HTMLElement} containerEl The element to attach the setting to.
     * @param  {string} name
     * @param  {string} desc
     * @param  {string} initialValue
     * @param  {ListTypedConfigKey|StringTypedConfigKey} configStorageKey The SwitcherPlusSettings key where the value for this setting should be stored.
     * @param  {string} placeholderText?
     * @returns Setting
     */
    addTextAreaSetting(containerEl, name, desc, initialValue, configStorageKey, placeholderText) {
        const setting = this.createSetting(containerEl, name, desc);
        setting.addTextArea((comp) => {
            comp.setPlaceholder(placeholderText);
            comp.setValue(initialValue);
            comp.onChange((rawValue) => {
                const value = rawValue.length ? rawValue : initialValue;
                const isArray = Array.isArray(this.config[configStorageKey]);
                this.saveChangesToConfig(configStorageKey, isArray ? value.split('\n') : value);
            });
        });
        return setting;
    }
    /**
     * Add a dropdown list setting
     * @param  {HTMLElement} containerEl
     * @param  {string} name
     * @param  {string} desc
     * @param  {string} initialValue option value that is initially selected
     * @param  {Record<string, string>} options
     * @param  {StringTypedConfigKey} configStorageKey The SwitcherPlusSettings key where the value for this setting should be stored. This can safely be set to null if the onChange handler is provided.
     * @param  {(rawValue:string,config:SwitcherPlusSettings)=>void} onChange? optional callback to invoke instead of using configStorageKey
     * @returns Setting
     */
    addDropdownSetting(containerEl, name, desc, initialValue, options, configStorageKey, onChange) {
        const setting = this.createSetting(containerEl, name, desc);
        setting.addDropdown((comp) => {
            comp.addOptions(options);
            comp.setValue(initialValue);
            comp.onChange((rawValue) => {
                if (onChange) {
                    onChange(rawValue, this.config);
                }
                else {
                    this.saveChangesToConfig(configStorageKey, rawValue);
                }
            });
        });
        return setting;
    }
    /**
     * Updates the internal SwitcherPlusSettings configStorageKey with value, and writes it to disk.
     * @param  {K} configStorageKey The SwitcherPlusSettings key where the value for this setting should be stored.
     * @param  {SwitcherPlusSettings[K]} value
     * @returns void
     */
    saveChangesToConfig(configStorageKey, value) {
        if (configStorageKey) {
            const { config } = this;
            config[configStorageKey] = value;
            config.save();
        }
    }
}

class StarredSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Starred List Mode Settings');
        this.addTextSetting(containerEl, 'Starred list mode trigger', 'Character that will trigger starred list mode in the switcher', config.starredListCommand, 'starredListCommand', config.starredListPlaceholderText);
    }
}

class CommandListSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Command List Mode Settings');
        this.addTextSetting(containerEl, 'Command list mode trigger', 'Character that will trigger command list mode in the switcher', config.commandListCommand, 'commandListCommand', config.commandListPlaceholderText);
    }
}

class RelatedItemsSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Related Items List Mode Settings');
        this.addTextSetting(containerEl, 'Related Items list mode trigger', 'Character that will trigger related items list mode in the switcher. This triggers a display of Related Items for the source file of the currently selected (highlighted) suggestion in the switcher', config.relatedItemsListCommand, 'relatedItemsListCommand', config.relatedItemsListPlaceholderText);
        this.showEnabledRelatedItems(containerEl, config);
        this.addToggleSetting(containerEl, 'Exclude open files', 'Enable, related files which are already open will not be displayed in the list. Disabled, All related files will be displayed in the list.', config.excludeOpenRelatedFiles, 'excludeOpenRelatedFiles');
    }
    showEnabledRelatedItems(containerEl, config) {
        const relationTypes = Object.values(RelationType).sort();
        const relationTypesStr = relationTypes.join(', ');
        const desc = `The types of related items to show in the list. Add one type per line. Available types: ${relationTypesStr}`;
        this.createSetting(containerEl, 'Show related item types', desc).addTextArea((textArea) => {
            textArea.setValue(config.enabledRelatedItems.join('\n'));
            textArea.inputEl.addEventListener('focusout', () => {
                const values = textArea
                    .getValue()
                    .split('\n')
                    .map((v) => v.trim())
                    .filter((v) => v.length > 0);
                const invalidValues = [...new Set(values)].filter((v) => !relationTypes.includes(v));
                if (invalidValues?.length) {
                    this.showErrorPopup(invalidValues.join('<br/>'), relationTypesStr);
                }
                else {
                    config.enabledRelatedItems = values;
                    config.save();
                }
            });
        });
    }
    showErrorPopup(invalidTypes, relationTypes) {
        const popup = new obsidian.Modal(this.app);
        popup.titleEl.setText('Invalid related item type');
        popup.contentEl.innerHTML = `Changes not saved. Available relation types are: ${relationTypes}. The following types are invalid:<br/><br/>${invalidTypes}`;
        popup.open();
    }
}

class GeneralSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        this.addSectionTitle(containerEl, 'General Settings');
        this.addToggleSetting(containerEl, 'Default to open in new tab', 'When enabled, navigating to un-opened files will open a new editor tab whenever possible (as if cmd/ctrl were held). When the file is already open, the existing tab will be activated. This overrides all other tab settings.', this.config.onOpenPreferNewTab, 'onOpenPreferNewTab');
        this.setPathDisplayFormat(containerEl, this.config);
        this.addToggleSetting(containerEl, 'Override Standard mode behavior', 'When enabled, Switcher++ will change the default Obsidian builtin Switcher functionality (Standard mode) to inject custom behavior.', this.config.overrideStandardModeBehaviors, 'overrideStandardModeBehaviors');
    }
    setPathDisplayFormat(containerEl, config) {
        const options = {};
        options[PathDisplayFormat.None.toString()] = 'Hide path';
        options[PathDisplayFormat.Full.toString()] = 'Full path';
        options[PathDisplayFormat.FolderOnly.toString()] = 'Only parent folder';
        options[PathDisplayFormat.FolderWithFilename.toString()] = 'Parent folder & filename';
        options[PathDisplayFormat.FolderPathFilenameOptional.toString()] =
            'Parent folder path (filename optional)';
        this.addDropdownSetting(containerEl, 'Preferred file path display format', 'The preferred way to display file paths in suggestions', config.pathDisplayFormat.toString(), options, null, (rawValue, config) => {
            config.pathDisplayFormat = Number(rawValue);
            config.save();
        });
    }
}

class WorkspaceSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Workspace List Mode Settings');
        this.addTextSetting(containerEl, 'Workspace list mode trigger', 'Character that will trigger workspace list mode in the switcher', config.workspaceListCommand, 'workspaceListCommand', config.workspaceListPlaceholderText);
    }
}

class EditorSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Editor List Mode Settings');
        this.addTextSetting(containerEl, 'Editor list mode trigger', 'Character that will trigger editor list mode in the switcher', config.editorListCommand, 'editorListCommand', config.editorListPlaceholderText);
        this.setIncludeSidePanelViews(containerEl, config);
    }
    setIncludeSidePanelViews(containerEl, config) {
        const viewsListing = Object.keys(this.app.viewRegistry.viewByType).sort().join(' ');
        const desc = `When in Editor list mode, show the following view types from the side panels. Add one view type per line. Available view types: ${viewsListing}`;
        this.addTextAreaSetting(containerEl, 'Include side panel views', desc, config.includeSidePanelViewTypes.join('\n'), 'includeSidePanelViewTypes', config.includeSidePanelViewTypesPlaceholder);
    }
}

class HeadingsSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Headings List Mode Settings');
        this.addTextSetting(containerEl, 'Headings list mode trigger', 'Character that will trigger headings list mode in the switcher', config.headingsListCommand, 'headingsListCommand', config.headingsListPlaceholderText);
        this.addToggleSetting(containerEl, 'Show headings only', 'Enabled, strictly search through only the headings contained in the file. Note: this setting overrides the "Show existing only", and "Search filenames" settings. Disabled, fallback to searching against the filename when there is not a match in the first H1 contained in the file. This will also allow searching through filenames, Aliases, and Unresolved links to be enabled.', config.strictHeadingsOnly, 'strictHeadingsOnly');
        this.addToggleSetting(containerEl, 'Search all headings', 'Enabled, search through all headings contained in each file. Disabled, only search through the first H1 in each file.', config.searchAllHeadings, 'searchAllHeadings');
        this.addToggleSetting(containerEl, 'Search filenames', "Enabled, search and show suggestions for filenames. Disabled, Don't search through filenames (except for fallback searches)", config.shouldSearchFilenames, 'shouldSearchFilenames');
        this.setExcludeFolders(containerEl, config);
        this.addToggleSetting(containerEl, 'Hide Obsidian "Excluded files"', 'Enabled, do not display suggestions for files that are in Obsidian\'s "Options > Files & Links > Excluded files" list. Disabled, suggestions for those files will be displayed but downranked.', config.excludeObsidianIgnoredFiles, 'excludeObsidianIgnoredFiles');
    }
    setExcludeFolders(containerEl, config) {
        const settingName = 'Exclude folders';
        this.createSetting(containerEl, settingName, 'When in Headings list mode, folder path that match any regex listed here will not be searched for suggestions. Path should start from the Vault Root. Add one path per line.').addTextArea((textArea) => {
            textArea.setValue(config.excludeFolders.join('\n'));
            textArea.inputEl.addEventListener('blur', () => {
                const excludes = textArea
                    .getValue()
                    .split('\n')
                    .filter((v) => v.length > 0);
                if (this.validateExcludeFolderList(settingName, excludes)) {
                    config.excludeFolders = excludes;
                    config.save();
                }
            });
        });
    }
    validateExcludeFolderList(settingName, excludes) {
        let isValid = true;
        let failedMsg = '';
        for (const str of excludes) {
            try {
                new RegExp(str);
            }
            catch (err) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                failedMsg += `<span class="qsp-warning">${str}</span><br/>${err}<br/><br/>`;
                isValid = false;
            }
        }
        if (!isValid) {
            const popup = new obsidian.Modal(this.app);
            popup.titleEl.setText(settingName);
            popup.contentEl.innerHTML = `Changes not saved. The following regex contain errors:<br/><br/>${failedMsg}`;
            popup.open();
        }
        return isValid;
    }
}

class SymbolSettingsTabSection extends SettingsTabSection {
    display(containerEl) {
        const { config } = this;
        this.addSectionTitle(containerEl, 'Symbol List Mode Settings');
        this.addTextSetting(containerEl, 'Symbol list mode trigger', 'Character that will trigger symbol list mode in the switcher. This triggers a display of Symbols for the source file of the currently selected (highlighted) suggestion in the switcher', config.symbolListCommand, 'symbolListCommand', config.symbolListPlaceholderText);
        this.addToggleSetting(containerEl, 'List symbols as indented outline', 'Enabled, symbols will be displayed in the (line) order they appear in the source text, indented under any preceding heading. Disabled, symbols will be grouped by type: Headings, Tags, Links, Embeds.', config.symbolsInLineOrder, 'symbolsInLineOrder');
        this.addToggleSetting(containerEl, 'Open Symbols in new tab', 'Enabled, always open a new tab when navigating to Symbols. Disabled, navigate in an already open tab (if one exists)', config.alwaysNewTabForSymbols, 'alwaysNewTabForSymbols');
        this.addToggleSetting(containerEl, 'Open Symbols in active tab on mobile devices', 'Enabled, navigate to the target file and symbol in the active editor tab. Disabled, open a new tab when navigating to Symbols, even on mobile devices.', config.useActiveTabForSymbolsOnMobile, 'useActiveTabForSymbolsOnMobile');
        this.addToggleSetting(containerEl, 'Auto-select nearest heading', 'Enabled, in an unfiltered symbol list, select the closest preceding Heading to the current cursor position. Disabled, the first symbol in the list is selected.', config.selectNearestHeading, 'selectNearestHeading');
        this.showEnableSymbolTypesToggle(containerEl, config);
        this.showEnableLinksToggle(containerEl, config);
    }
    showEnableSymbolTypesToggle(containerEl, config) {
        const allowedSymbols = [
            ['Show Headings', SymbolType.Heading],
            ['Show Tags', SymbolType.Tag],
            ['Show Embeds', SymbolType.Embed],
            ['Show Callouts', SymbolType.Callout],
        ];
        allowedSymbols.forEach(([name, symbolType]) => {
            this.addToggleSetting(containerEl, name, '', config.isSymbolTypeEnabled(symbolType), null, (isEnabled) => {
                config.setSymbolTypeEnabled(symbolType, isEnabled);
                config.save();
            });
        });
    }
    showEnableLinksToggle(containerEl, config) {
        const isLinksEnabled = config.isSymbolTypeEnabled(SymbolType.Link);
        this.addToggleSetting(containerEl, 'Show Links', '', isLinksEnabled, null, (isEnabled) => {
            config.setSymbolTypeEnabled(SymbolType.Link, isEnabled);
            // have to wait for the save here because the call to display() will
            // trigger a read of the updated data
            config.saveSettings().then(() => {
                // reload the settings panel. This will cause the sublink types toggle
                // controls to be shown/hidden based on isLinksEnabled status
                this.mainSettingsTab.display();
            }, (reason) => console.log('Switcher++: error saving "Show Links" setting. ', reason));
        });
        if (isLinksEnabled) {
            const allowedLinkTypes = [
                ['Links to headings', LinkType.Heading],
                ['Links to blocks', LinkType.Block],
            ];
            allowedLinkTypes.forEach(([name, linkType]) => {
                const isExcluded = (config.excludeLinkSubTypes & linkType) === linkType;
                const setting = this.addToggleSetting(containerEl, name, '', !isExcluded, null, (isEnabled) => this.saveEnableSubLinkChange(linkType, isEnabled));
                setting.setClass('qsp-setting-item-indent');
            });
        }
    }
    saveEnableSubLinkChange(linkType, isEnabled) {
        const { config } = this;
        let exclusions = config.excludeLinkSubTypes;
        if (isEnabled) {
            // remove from exclusion list
            exclusions &= ~linkType;
        }
        else {
            // add to exclusion list
            exclusions |= linkType;
        }
        config.excludeLinkSubTypes = exclusions;
        config.save();
    }
}

class SwitcherPlusSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, config) {
        super(app, plugin);
        this.config = config;
    }
    display() {
        const { containerEl } = this;
        const tabSections = [
            GeneralSettingsTabSection,
            SymbolSettingsTabSection,
            HeadingsSettingsTabSection,
            EditorSettingsTabSection,
            RelatedItemsSettingsTabSection,
            StarredSettingsTabSection,
            CommandListSettingsTabSection,
            WorkspaceSettingsTabSection,
        ];
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Quick Switcher++ Settings' });
        tabSections.forEach((tabSectionClass) => {
            this.displayTabSection(tabSectionClass);
        });
    }
    displayTabSection(tabSectionClass) {
        const { app, config, containerEl } = this;
        const tabSection = new tabSectionClass(app, this, config);
        tabSection.display(containerEl);
    }
}

class Handler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
    get commandString() {
        return null;
    }
    reset() {
        /* noop */
    }
    getEditorInfo(leaf) {
        const { excludeViewTypes } = this.settings;
        let file = null;
        let isValidSource = false;
        let cursor = null;
        if (leaf) {
            const { view } = leaf;
            const viewType = view.getViewType();
            file = view.file;
            cursor = this.getCursorPosition(view);
            // determine if the current active editor pane is valid
            const isCurrentEditorValid = !excludeViewTypes.includes(viewType);
            // whether or not the current active editor can be used as the target for
            // symbol search
            isValidSource = isCurrentEditorValid && !!file;
        }
        return { isValidSource, leaf, file, suggestion: null, cursor };
    }
    getSuggestionInfo(suggestion) {
        const info = this.getSourceInfoFromSuggestion(suggestion);
        let leaf = info.leaf;
        if (info.isValidSource) {
            // try to find a matching leaf for suggestion types that don't explicitly
            // provide one. This is primarily needed to be able to focus an
            // existing pane if there is one
            ({ leaf } = this.findMatchingLeaf(info.file, info.leaf));
        }
        // Get the cursor information to support `selectNearestHeading`
        const cursor = this.getCursorPosition(leaf?.view);
        return { ...info, leaf, cursor };
    }
    getSourceInfoFromSuggestion(suggestion) {
        let file = null;
        let leaf = null;
        // Can't use a symbol, workspace, unresolved (non-existent file) suggestions as
        // the target for another symbol command, because they don't point to a file
        const isFileBasedSuggestion = suggestion &&
            !isSymbolSuggestion(suggestion) &&
            !isUnresolvedSuggestion(suggestion) &&
            !isWorkspaceSuggestion(suggestion) &&
            !isCommandSuggestion(suggestion);
        if (isFileBasedSuggestion) {
            file = suggestion.file;
        }
        if (isEditorSuggestion(suggestion)) {
            leaf = suggestion.item;
        }
        const isValidSource = !!file;
        return { isValidSource, leaf, file, suggestion };
    }
    /**
     * Retrieves the position of the cursor, given that view is in a Mode that supports cursors.
     * @param  {View} view
     * @returns EditorPosition
     */
    getCursorPosition(view) {
        let cursor = null;
        if (view?.getViewType() === 'markdown') {
            const md = view;
            if (md.getMode() !== 'preview') {
                const { editor } = md;
                cursor = editor.getCursor('head');
            }
        }
        return cursor;
    }
    /**
     * Returns the text of the first H1 contained in sourceFile, or sourceFile
     * path if an H1 does not exist
     * @param  {TFile} sourceFile
     * @returns string
     */
    getTitleText(sourceFile) {
        const path = stripMDExtensionFromPath(sourceFile);
        const h1 = this.getFirstH1(sourceFile);
        return h1?.heading ?? path;
    }
    /**
     * Finds and returns the first H1 from sourceFile
     * @param  {TFile} sourceFile
     * @returns HeadingCache
     */
    getFirstH1(sourceFile) {
        let h1 = null;
        const { metadataCache } = this.app;
        const headingList = metadataCache.getFileCache(sourceFile)?.headings?.filter((v) => v.level === 1) ??
            [];
        if (headingList.length) {
            h1 = headingList.reduce((acc, curr) => {
                const { line: currLine } = curr.position.start;
                const accLine = acc.position.start.line;
                return currLine < accLine ? curr : acc;
            });
        }
        return h1;
    }
    /**
     * Finds the first open WorkspaceLeaf that is showing source file.
     * @param  {TFile} file The source file that is being shown to find
     * @param  {WorkspaceLeaf} leaf An already open editor, or, a 'reference' WorkspaceLeaf (example: backlinks, outline, etc.. views) that is used to find the associated editor if one exists.
     * @param  {} shouldIncludeRefViews=false set to true to make reference view types valid return candidates.
     * @returns TargetInfo
     */
    findMatchingLeaf(file, leaf, shouldIncludeRefViews = false) {
        let matchingLeaf = null;
        const hasSourceLeaf = !!leaf;
        const { settings: { referenceViews, excludeViewTypes, includeSidePanelViewTypes }, } = this;
        const isMatch = (candidateLeaf) => {
            let val = false;
            if (candidateLeaf?.view) {
                const isCandidateRefView = referenceViews.includes(candidateLeaf.view.getViewType());
                const isValidCandidate = shouldIncludeRefViews || !isCandidateRefView;
                const isSourceRefView = hasSourceLeaf && referenceViews.includes(leaf.view.getViewType());
                if (isValidCandidate) {
                    if (hasSourceLeaf && (shouldIncludeRefViews || !isSourceRefView)) {
                        val = candidateLeaf === leaf;
                    }
                    else {
                        val = candidateLeaf.view.file === file;
                    }
                }
            }
            return val;
        };
        // Prioritize the active leaf matches first, otherwise find the first matching leaf
        const activeLeaf = this.getActiveLeaf();
        if (isMatch(activeLeaf)) {
            matchingLeaf = activeLeaf;
        }
        else {
            const leaves = this.getOpenLeaves(excludeViewTypes, includeSidePanelViewTypes);
            // put leaf at the first index so it gets checked first
            matchingLeaf = [leaf, ...leaves].find(isMatch);
        }
        return {
            leaf: matchingLeaf ?? null,
            file,
            suggestion: null,
            isValidSource: false,
        };
    }
    /** Determines if an existing tab should be reused, or create new tab, or create new window based on evt and taking into account user preferences
     * @param  {MouseEvent|KeyboardEvent} evt
     * @param  {boolean} isAlreadyOpen?
     * @param  {Mode} mode? Only Symbol mode has special handling.
     * @returns {navType: boolean | PaneType; splitDirection: SplitDirection}
     */
    extractTabNavigationType(evt, isAlreadyOpen, mode) {
        const splitDirection = evt?.shiftKey ? 'horizontal' : 'vertical';
        const key = evt?.key;
        let navType = obsidian.Keymap.isModEvent(evt) ?? false;
        if (navType === true || navType === 'tab') {
            if (key === 'o') {
                // cmd-o to create new window
                navType = 'window';
            }
            else if (key === '\\') {
                // cmd-\ to create split
                navType = 'split';
            }
        }
        navType = this.applyTabCreationPreferences(navType, isAlreadyOpen, mode);
        return { navType, splitDirection };
    }
    /**
     * Determines whether or not a new leaf should be created taking user
     * settings into account
     * @param  {PaneType | boolean} navType
     * @param  {} isAlreadyOpen=false Set to true if there is a pane showing the file already
     * @param  {Mode} mode? Only Symbol mode has special handling.
     * @returns boolean
     */
    applyTabCreationPreferences(navType, isAlreadyOpen = false, mode) {
        let preferredNavType = navType;
        const { onOpenPreferNewTab, alwaysNewTabForSymbols, useActiveTabForSymbolsOnMobile } = this.settings;
        if (navType === false) {
            if (onOpenPreferNewTab) {
                preferredNavType = !isAlreadyOpen;
            }
            else if (mode === Mode.SymbolList) {
                preferredNavType = obsidian.Platform.isMobile
                    ? !useActiveTabForSymbolsOnMobile
                    : alwaysNewTabForSymbols;
            }
        }
        return preferredNavType;
    }
    /**
     * Determines if a leaf belongs to the main editor panel (workspace.rootSplit or
     * workspace.floatingSplit) as opposed to the side panels
     * @param  {WorkspaceLeaf} leaf
     * @returns boolean
     */
    isMainPanelLeaf(leaf) {
        const { workspace } = this.app;
        const root = leaf?.getRoot();
        return root === workspace.rootSplit || root === workspace.floatingSplit;
    }
    /**
     * Reveals and optionally bring into focus a WorkspaceLeaf, including leaves
     * from the side panels.
     * @param  {WorkspaceLeaf} leaf
     * @param  {boolean} pushHistory?
     * @param  {Record<string} eState?
     * @param  {} unknown>
     * @returns void
     */
    activateLeaf(leaf, pushHistory, eState) {
        const { workspace } = this.app;
        const isInSidePanel = !this.isMainPanelLeaf(leaf);
        const state = { focus: true, ...eState };
        if (isInSidePanel) {
            workspace.revealLeaf(leaf);
        }
        workspace.setActiveLeaf(leaf, pushHistory, true);
        leaf.view.setEphemeralState(state);
    }
    /**
     * Returns a array of all open WorkspaceLeaf taking into account
     * excludeMainPanelViewTypes and includeSidePanelViewTypes.
     * @param  {string[]} excludeMainPanelViewTypes?
     * @param  {string[]} includeSidePanelViewTypes?
     * @returns WorkspaceLeaf[]
     */
    getOpenLeaves(excludeMainPanelViewTypes, includeSidePanelViewTypes) {
        const leaves = [];
        const saveLeaf = (l) => {
            const viewType = l.view?.getViewType();
            if (this.isMainPanelLeaf(l)) {
                if (!excludeMainPanelViewTypes?.includes(viewType)) {
                    leaves.push(l);
                }
            }
            else if (includeSidePanelViewTypes?.includes(viewType)) {
                leaves.push(l);
            }
        };
        this.app.workspace.iterateAllLeaves(saveLeaf);
        return leaves;
    }
    /**
     * Loads a file into a WorkspaceLeaf based on navType
     * @param  {TFile} file
     * @param  {PaneType|boolean} navType
     * @param  {OpenViewState} openState?
     * @param  {string} errorContext?
     * @param  {SplitDirection} splitDirection if navType is 'split', the direction to
     * open the split. Defaults to 'vertical'
     * @returns void
     */
    openFileInLeaf(file, navType, openState, errorContext, splitDirection = 'vertical') {
        const { workspace } = this.app;
        errorContext = errorContext ?? '';
        const message = `Switcher++: error opening file. ${errorContext}`;
        const getLeaf = () => {
            return navType === 'split'
                ? workspace.getLeaf(navType, splitDirection)
                : workspace.getLeaf(navType);
        };
        try {
            getLeaf()
                .openFile(file, openState)
                .catch((reason) => {
                console.log(message, reason);
            });
        }
        catch (error) {
            console.log(message, error);
        }
    }
    /**
     * Determines whether to activate (make active and focused) an existing WorkspaceLeaf
     * (searches through all leaves), or create a new WorkspaceLeaf, or reuse an unpinned
     * WorkspaceLeaf, or create a new window in order to display file. This takes user
     * settings and event status into account.
     * @param  {MouseEvent|KeyboardEvent} evt navigation trigger event
     * @param  {TFile} file The file to display
     * @param  {string} errorContext Custom text to save in error messages
     * @param  {OpenViewState} openState? State to pass to the new, or activated view. If
     * falsy, default values will be used
     * @param  {WorkspaceLeaf} leaf? WorkspaceLeaf, or reference WorkspaceLeaf
     * (backlink, outline, etc..) to activate if it's already known
     * @param  {Mode} mode? Only Symbol mode has custom handling
     * @param  {boolean} shouldIncludeRefViews whether reference WorkspaceLeaves are valid
     * targets for activation
     * @returns void
     */
    navigateToLeafOrOpenFile(evt, file, errorContext, openState, leaf, mode, shouldIncludeRefViews = false) {
        const { leaf: targetLeaf } = this.findMatchingLeaf(file, leaf, shouldIncludeRefViews);
        const isAlreadyOpen = !!targetLeaf;
        const { navType, splitDirection } = this.extractTabNavigationType(evt, isAlreadyOpen, mode);
        this.activateLeafOrOpenFile(navType, file, errorContext, targetLeaf, openState, splitDirection);
    }
    /**
     * Activates leaf (if provided), or load file into another leaf based on navType
     * @param  {PaneType|boolean} navType
     * @param  {TFile} file
     * @param  {string} errorContext
     * @param  {WorkspaceLeaf} leaf? optional if supplied and navType is
     * false then leaf will be activated
     * @param  {OpenViewState} openState?
     * @param  {SplitDirection} splitDirection? if navType is 'split', the direction to
     * open the split
     * @returns void
     */
    activateLeafOrOpenFile(navType, file, errorContext, leaf, openState, splitDirection) {
        // default to having the pane active and focused
        openState = openState ?? { active: true, eState: { active: true, focus: true } };
        if (leaf && navType === false) {
            const eState = openState?.eState;
            this.activateLeaf(leaf, true, eState);
        }
        else {
            this.openFileInLeaf(file, navType, openState, errorContext, splitDirection);
        }
    }
    /**
     * Renders the UI elements to display path information for file using the
     * stored configuration settings
     * @param  {HTMLElement} parentEl containing element, this should be the element with
     * the "suggestion-content" style
     * @param  {TFile} file
     * @param  {boolean} excludeOptionalFilename? set to true to hide the filename in cases
     * where when {PathDisplayFormat} is set to FolderPathFilenameOptional
     * @param  {SearchResult} match?
     * @param  {boolean} overridePathFormat? set to true force display the path and set
     * {PathDisplayFormat} to FolderPathFilenameOptional
     * @returns void
     */
    renderPath(parentEl, file, excludeOptionalFilename, match, overridePathFormat) {
        if (parentEl && file) {
            const isRoot = file.parent.isRoot();
            let format = this.settings.pathDisplayFormat;
            let hidePath = format === PathDisplayFormat.None || (isRoot && this.settings.hidePathIfRoot);
            if (overridePathFormat) {
                format = PathDisplayFormat.FolderPathFilenameOptional;
                hidePath = false;
            }
            if (!hidePath) {
                const wrapperEl = parentEl.createDiv({ cls: ['suggestion-note', 'qsp-note'] });
                const path = this.getPathDisplayText(file, format, excludeOptionalFilename);
                const iconEl = wrapperEl.createSpan({ cls: ['qsp-path-indicator'] });
                obsidian.setIcon(iconEl, 'folder', 13);
                const pathEl = wrapperEl.createSpan({ cls: 'qsp-path' });
                obsidian.renderResults(pathEl, path, match);
            }
        }
    }
    /**
     * Formats the path of file based on displayFormat
     * @param  {TFile} file
     * @param  {PathDisplayFormat} displayFormat
     * @param  {boolean} excludeOptionalFilename? Only applicable to
     * {PathDisplayFormat.FolderPathFilenameOptional}. When true will exclude the filename from the returned string
     * @returns string
     */
    getPathDisplayText(file, displayFormat, excludeOptionalFilename) {
        let text = '';
        if (file) {
            const { parent } = file;
            const dirname = parent.name;
            const isRoot = parent.isRoot();
            // root path is expected to always be "/"
            const rootPath = this.app.vault.getRoot().path;
            switch (displayFormat) {
                case PathDisplayFormat.FolderWithFilename:
                    text = isRoot ? `${file.name}` : obsidian.normalizePath(`${dirname}/${file.name}`);
                    break;
                case PathDisplayFormat.FolderOnly:
                    text = isRoot ? rootPath : dirname;
                    break;
                case PathDisplayFormat.Full:
                    text = file.path;
                    break;
                case PathDisplayFormat.FolderPathFilenameOptional:
                    if (excludeOptionalFilename) {
                        text = parent.path;
                        if (!isRoot) {
                            text += rootPath; // add explicit trailing /
                        }
                    }
                    else {
                        text = this.getPathDisplayText(file, PathDisplayFormat.Full);
                    }
                    break;
            }
        }
        return text;
    }
    /**
     * Creates the UI elements to display the primary suggestion text using
     * the correct styles.
     * @param  {HTMLElement} parentEl containing element, this should be the element with
     * the "suggestion-item" style
     * @param  {string} content
     * @param  {SearchResult} match
     * @param  {number} offset?
     * @returns HTMLDivElement
     */
    renderContent(parentEl, content, match, offset) {
        const contentEl = parentEl.createDiv({
            cls: ['suggestion-content', 'qsp-content'],
        });
        const titleEl = contentEl.createDiv({
            cls: ['suggestion-title', 'qsp-title'],
        });
        obsidian.renderResults(titleEl, content, match, offset);
        return contentEl;
    }
    /** add the base suggestion styles to the suggestion container element
     * @param  {HTMLElement} parentEl container element
     * @param  {string[]} additionalStyles? optional styles to add
     */
    addClassesToSuggestionContainer(parentEl, additionalStyles) {
        const styles = ['mod-complex'];
        if (additionalStyles) {
            styles.push(...additionalStyles);
        }
        parentEl?.addClasses(styles);
    }
    /**
     * Searches through primaryString, if not match is found,
     * searches through secondaryString
     * @param  {PreparedQuery} prepQuery
     * @param  {string} primaryString
     * @param  {string} secondaryString?
     * @returns { isPrimary: boolean; match?: SearchResult }
     */
    fuzzySearchStrings(prepQuery, primaryString, secondaryString) {
        let isPrimary = false;
        let match = null;
        if (primaryString) {
            match = obsidian.fuzzySearch(prepQuery, primaryString);
            isPrimary = !!match;
        }
        if (!match && secondaryString) {
            match = obsidian.fuzzySearch(prepQuery, secondaryString);
            if (match) {
                match.score -= 1;
            }
        }
        return {
            isPrimary,
            match,
        };
    }
    /**
     * Searches through primaryText, if no match is found and file is not null, it will
     * fallback to searching 1) file.basename, 2) file.path
     * @param  {PreparedQuery} prepQuery
     * @param  {string} primaryString?
     * @param  {TFile} file
     * @returns SearchResultWithFallback
     */
    fuzzySearchWithFallback(prepQuery, primaryString, file) {
        let matchType = MatchType.None;
        let matchText;
        let match = null;
        const search = (matchTypes, p1, p2) => {
            const res = this.fuzzySearchStrings(prepQuery, p1, p2);
            if (res.match) {
                matchType = matchTypes[1];
                matchText = p2;
                match = res.match;
                if (res.isPrimary) {
                    matchType = matchTypes[0];
                    matchText = p1;
                }
            }
            return !!res.match;
        };
        const isMatch = search([MatchType.Primary, MatchType.None], primaryString);
        if (!isMatch && file) {
            const { basename, path } = file;
            // Note: the fallback to path has to search through the entire path
            // because search needs to match over the filename/basename boundaries
            // e.g. search string "to my" should match "path/to/myfile.md"
            // that means MatchType.Basename will always be in the basename, while
            // MatchType.ParentPath can span both filename and basename
            search([MatchType.Basename, MatchType.Path], basename, path);
        }
        return { matchType, matchText, match };
    }
    /**
     * Separate match into two groups, one that only matches the path segment of file, and
     * a second that only matches the filename segment
     * @param  {TFile} file
     * @param  {SearchResult} match
     * @returns {SearchResult; SearchResult}
     */
    splitSearchMatchesAtBasename(file, match) {
        let basenameMatch = null;
        let pathMatch = null;
        // function to re-anchor offsets by a certain amount
        const decrementOffsets = (offsets, amount) => {
            offsets.forEach((offset) => {
                offset[0] -= amount;
                offset[1] -= amount;
            });
        };
        if (file && match?.matches) {
            const { name, path } = file;
            const nameIndex = path.lastIndexOf(name);
            if (nameIndex >= 0) {
                const { matches, score } = match;
                const matchStartIndex = matches[0][0];
                const matchEndIndex = matches[matches.length - 1][1];
                if (matchStartIndex >= nameIndex) {
                    // the entire match offset is in the basename segment, so match can be used
                    // for basename
                    basenameMatch = match;
                    decrementOffsets(basenameMatch.matches, nameIndex);
                }
                else if (matchEndIndex <= nameIndex) {
                    // the entire match offset is in the path segment
                    pathMatch = match;
                }
                else {
                    // the match offset spans both path and basename, so they will have to
                    // to be split up. Note that the entire SearchResult can span both, and
                    // a single SearchMatchPart inside the SearchResult can also span both
                    let i = matches.length;
                    while (i--) {
                        const matchPartStartIndex = matches[i][0];
                        const matchPartEndIndex = matches[i][1];
                        const nextMatchPartIndex = i + 1;
                        if (matchPartEndIndex <= nameIndex) {
                            // the last path segment MatchPart ends cleanly in the path segment
                            pathMatch = { score, matches: matches.slice(0, nextMatchPartIndex) };
                            basenameMatch = { score, matches: matches.slice(nextMatchPartIndex) };
                            decrementOffsets(basenameMatch.matches, nameIndex);
                            break;
                        }
                        else if (matchPartStartIndex < nameIndex) {
                            // the last MatchPart starts in path segment and ends in basename segment
                            // adjust the end of the path segment MatchPart to finish at the end
                            // of the path segment
                            let offsets = matches.slice(0, nextMatchPartIndex);
                            offsets[offsets.length - 1] = [matchPartStartIndex, nameIndex];
                            pathMatch = { score, matches: offsets };
                            // adjust the beginning of the first basename segment MatchPart to start
                            // at the beginning of the basename segment
                            offsets = matches.slice(i);
                            decrementOffsets(offsets, nameIndex);
                            offsets[0][0] = 0;
                            basenameMatch = { score, matches: offsets };
                            break;
                        }
                    }
                }
            }
        }
        return { pathMatch, basenameMatch };
    }
    /**
     * Display the provided information as a suggestion with the content and path information on separate lines
     * @param  {HTMLElement} parentEl
     * @param  {string[]} parentElStyles
     * @param  {string} primaryString
     * @param  {TFile} file
     * @param  {MatchType} matchType
     * @param  {SearchResult} match
     * @param  {} excludeOptionalFilename=true
     * @returns void
     */
    renderAsFileInfoPanel(parentEl, parentElStyles, primaryString, file, matchType, match, excludeOptionalFilename = true) {
        let primaryMatch = null;
        let pathMatch = null;
        if (primaryString?.length) {
            if (matchType === MatchType.Primary) {
                primaryMatch = match;
            }
            else if (matchType === MatchType.Path) {
                pathMatch = match;
            }
        }
        else if (file) {
            primaryString = file.basename;
            if (matchType === MatchType.Basename) {
                primaryMatch = match;
            }
            else if (matchType === MatchType.Path) {
                // MatchType.ParentPath can span both filename and basename
                // (partial match in each) so try to split the match offsets
                ({ pathMatch, basenameMatch: primaryMatch } = this.splitSearchMatchesAtBasename(file, match));
            }
        }
        this.addClassesToSuggestionContainer(parentEl, parentElStyles);
        const contentEl = this.renderContent(parentEl, primaryString, primaryMatch);
        this.renderPath(contentEl, file, excludeOptionalFilename, pathMatch, !!pathMatch);
    }
    /**
     * Returns the currently active leaf across all root workspace splits
     * @returns WorkspaceLeaf | null
     */
    getActiveLeaf() {
        return Handler.getActiveLeaf(this.app.workspace);
    }
    /**
     * Returns the currently active leaf across all root workspace splits
     * @param  {Workspace} workspace
     * @returns WorkspaceLeaf | null
     */
    static getActiveLeaf(workspace) {
        const leaf = workspace?.getActiveViewOfType(obsidian.View)?.leaf;
        return leaf ?? null;
    }
    /**
     * Displays extra flair icons for an item, and adds any associated css classes
     * to parentEl
     * @param  {HTMLElement} parentEl the suggestion container element
     * @param  {AnySuggestion} sugg the suggestion item
     * @param  {HTMLDivElement=null} flairContainerEl optional, if null, it will be created
     * @returns HTMLDivElement the flairContainerEl that was passed in or created
     */
    renderOptionalIndicators(parentEl, sugg, flairContainerEl = null) {
        const indicatorData = new Map();
        indicatorData.set('isRecentOpen', {
            iconName: 'history',
            parentElClass: 'qsp-recent-file',
            indicatorElClass: 'qsp-recent-indicator',
        });
        indicatorData.set('isOpenInEditor', {
            iconName: 'lucide-file-edit',
            parentElClass: 'qsp-open-editor',
            indicatorElClass: 'qsp-editor-indicator',
        });
        indicatorData.set('isStarred', {
            iconName: 'lucide-star',
            parentElClass: 'qsp-starred-file',
            indicatorElClass: 'qsp-starred-indicator',
        });
        if (!flairContainerEl) {
            flairContainerEl = this.createFlairContainer(parentEl);
        }
        for (const [state, data] of indicatorData.entries()) {
            if (sugg[state] === true) {
                if (data.parentElClass) {
                    parentEl?.addClass(data.parentElClass);
                }
                this.renderIndicator(flairContainerEl, [data.indicatorElClass], data.iconName);
            }
        }
        return flairContainerEl;
    }
    /**
     * @param  {HTMLDivElement} flairContainerEl
     * @param  {string[]} indicatorClasses additional css classes to add to flair element
     * @param  {string} svgIconName? the name of the svg icon to use
     * @param  {string} indicatorText? the text content of the flair element
     * @returns HTMLElement the flair icon wrapper element
     */
    renderIndicator(flairContainerEl, indicatorClasses, svgIconName, indicatorText) {
        const cls = ['suggestion-flair', ...indicatorClasses];
        const flairEl = flairContainerEl?.createSpan({ cls });
        if (flairEl) {
            if (svgIconName) {
                flairEl.addClass('svg-icon');
                obsidian.setIcon(flairEl, svgIconName);
            }
            if (indicatorText) {
                flairEl.setText(indicatorText);
            }
        }
        return flairEl;
    }
    /**
     * Creates a child Div element with the appropriate css classes for flair icons
     * @param  {HTMLElement} parentEl
     * @returns HTMLDivElement
     */
    createFlairContainer(parentEl) {
        return parentEl?.createDiv({ cls: ['suggestion-aux', 'qsp-aux'] });
    }
    /**
     * Retrieves a TFile object using path. Return null if path does not represent
     * a TFile object.
     * @param  {string} path
     * @returns TFile|null
     */
    getTFileByPath(path) {
        let file = null;
        const abstractItem = this.app.vault.getAbstractFileByPath(path);
        if (isTFile(abstractItem)) {
            file = abstractItem;
        }
        return file;
    }
    /**
     * @param  {WorkspaceEnvList} currentWorkspaceEnvList
     * @param  {V} sugg
     * @returns V
     */
    static updateWorkspaceEnvListStatus(currentWorkspaceEnvList, sugg) {
        if (currentWorkspaceEnvList && sugg?.file) {
            const { file } = sugg;
            sugg.isOpenInEditor = currentWorkspaceEnvList.openWorkspaceFiles?.has(file);
            sugg.isRecentOpen = currentWorkspaceEnvList.mostRecentFiles?.has(file);
            sugg.isStarred = currentWorkspaceEnvList.starredFiles?.has(file);
        }
        return sugg;
    }
    /**
     * Renders a suggestion hint for creating a new note
     * @param  {HTMLElement} parentEl
     * @param  {string} filename
     * @returns HTMLDivElement
     */
    renderFileCreationSuggestion(parentEl, filename) {
        this.addClassesToSuggestionContainer(parentEl);
        const contentEl = this.renderContent(parentEl, filename, null);
        const flairEl = this.createFlairContainer(parentEl);
        flairEl?.createSpan({
            cls: 'suggestion-hotkey',
            text: 'Enter to create',
        });
        return contentEl;
    }
    /**
     * Creates a new note in the vault with filename. Uses evt to determine the
     * navigation type (reuse tab, new tab, new window) to use for opening the newly
     * created note.
     * @param  {string} filename
     * @param  {MouseEvent|KeyboardEvent} evt
     * @returns void
     */
    createFile(filename, evt) {
        const { workspace } = this.app;
        const { navType } = this.extractTabNavigationType(evt);
        const activeView = workspace.getActiveViewOfType(obsidian.FileView);
        let sourcePath = '';
        if (activeView?.file) {
            sourcePath = activeView.file.path;
        }
        workspace
            .openLinkText(filename, sourcePath, navType, { active: true })
            .catch((err) => {
            console.log('Switcher++: error creating new file. ', err);
        });
    }
}

const WORKSPACE_PLUGIN_ID = 'workspaces';
class WorkspaceHandler extends Handler {
    get commandString() {
        return this.settings?.workspaceListCommand;
    }
    validateCommand(inputInfo, index, filterText, _activeSuggestion, _activeLeaf) {
        if (this.isWorkspacesPluginEnabled()) {
            inputInfo.mode = Mode.WorkspaceList;
            const workspaceCmd = inputInfo.parsedCommand(Mode.WorkspaceList);
            workspaceCmd.index = index;
            workspaceCmd.parsedInput = filterText;
            workspaceCmd.isValidated = true;
        }
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const items = this.getItems();
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, item.id);
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({ type: SuggestionType.WorkspaceList, item, match });
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            this.addClassesToSuggestionContainer(parentEl, ['qsp-suggestion-workspace']);
            this.renderContent(parentEl, sugg.item.id, sugg.match);
        }
    }
    onChooseSuggestion(sugg, _evt) {
        if (sugg) {
            const { id } = sugg.item;
            const pluginInstance = this.getSystemWorkspacesPluginInstance();
            if (typeof pluginInstance['loadWorkspace'] === 'function') {
                pluginInstance.loadWorkspace(id);
            }
        }
    }
    getItems() {
        const items = [];
        const workspaces = this.getSystemWorkspacesPluginInstance()?.workspaces;
        if (workspaces) {
            Object.keys(workspaces).forEach((id) => items.push({ id, type: 'workspaceInfo' }));
        }
        return items;
    }
    isWorkspacesPluginEnabled() {
        const plugin = this.getSystemWorkspacesPlugin();
        return plugin?.enabled;
    }
    getSystemWorkspacesPlugin() {
        return getInternalPluginById(this.app, WORKSPACE_PLUGIN_ID);
    }
    getSystemWorkspacesPluginInstance() {
        const workspacesPlugin = this.getSystemWorkspacesPlugin();
        return workspacesPlugin?.instance;
    }
}

class EditorHandler extends Handler {
    get commandString() {
        return this.settings?.editorListCommand;
    }
    validateCommand(inputInfo, index, filterText, _activeSuggestion, _activeLeaf) {
        inputInfo.mode = Mode.EditorList;
        const editorCmd = inputInfo.parsedCommand(Mode.EditorList);
        editorCmd.index = index;
        editorCmd.parsedInput = filterText;
        editorCmd.isValidated = true;
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const items = this.getItems();
            items.forEach((item) => {
                const file = item.view?.file;
                let shouldPush = true;
                let result = { matchType: MatchType.None, match: null };
                if (hasSearchTerm) {
                    result = this.fuzzySearchWithFallback(prepQuery, item.getDisplayText(), file);
                    shouldPush = result.matchType !== MatchType.None;
                }
                if (shouldPush) {
                    suggestions.push(EditorHandler.createSuggestion(inputInfo.currentWorkspaceEnvList, item, file, result));
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    getItems() {
        const { excludeViewTypes, includeSidePanelViewTypes } = this.settings;
        return this.getOpenLeaves(excludeViewTypes, includeSidePanelViewTypes);
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { file, matchType, match, item } = sugg;
            const hideBasename = [MatchType.None, MatchType.Primary].includes(matchType);
            this.renderAsFileInfoPanel(parentEl, ['qsp-suggestion-editor'], item.getDisplayText(), file, matchType, match, hideBasename);
            this.renderOptionalIndicators(parentEl, sugg);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            this.navigateToLeafOrOpenFile(evt, sugg.file, 'Unable to reopen existing editor in new Leaf.', null, sugg.item, null, true);
        }
    }
    static createSuggestion(currentWorkspaceEnvList, leaf, file, result) {
        result = result ?? { matchType: MatchType.None, match: null, matchText: null };
        const sugg = {
            item: leaf,
            file,
            type: SuggestionType.EditorList,
            ...result,
        };
        return Handler.updateWorkspaceEnvListStatus(currentWorkspaceEnvList, sugg);
    }
}

class HeadingsHandler extends Handler {
    get commandString() {
        return this.settings?.headingsListCommand;
    }
    validateCommand(inputInfo, index, filterText, _activeSuggestion, _activeLeaf) {
        inputInfo.mode = Mode.HeadingsList;
        const headingsCmd = inputInfo.parsedCommand(Mode.HeadingsList);
        headingsCmd.index = index;
        headingsCmd.parsedInput = filterText;
        headingsCmd.isValidated = true;
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const { start: { line, col }, end: endLoc, } = sugg.item.position;
            // state information to highlight the target heading
            const eState = {
                active: true,
                focus: true,
                startLoc: { line, col },
                endLoc,
                line,
                cursor: {
                    from: { line, ch: col },
                    to: { line, ch: col },
                },
            };
            this.navigateToLeafOrOpenFile(evt, sugg.file, 'Unable to navigate to heading for file.', { active: true, eState });
        }
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { item } = sugg;
            this.addClassesToSuggestionContainer(parentEl, [
                'qsp-suggestion-headings',
                `qsp-headings-l${item.level}`,
            ]);
            const contentEl = this.renderContent(parentEl, item.heading, sugg.match);
            this.renderPath(contentEl, sugg.file);
            // render the flair icons
            const flairContainerEl = this.createFlairContainer(parentEl);
            this.renderOptionalIndicators(parentEl, sugg, flairContainerEl);
            this.renderIndicator(flairContainerEl, ['qsp-headings-indicator'], null, HeadingIndicators[item.level]);
            if (sugg.downranked) {
                parentEl.addClass('mod-downranked');
            }
        }
    }
    getSuggestions(inputInfo) {
        let suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { hasSearchTerm } = inputInfo.searchQuery;
            if (hasSearchTerm) {
                const { limit } = this.settings;
                suggestions = this.getAllFilesSuggestions(inputInfo);
                obsidian.sortSearchResults(suggestions);
                if (suggestions.length > 0 && limit > 0) {
                    suggestions = suggestions.slice(0, limit);
                }
            }
            else {
                suggestions = this.getInitialSuggestionList(inputInfo);
            }
        }
        return suggestions;
    }
    getAllFilesSuggestions(inputInfo) {
        const suggestions = [];
        const { prepQuery } = inputInfo.searchQuery;
        const { app: { vault }, settings: { strictHeadingsOnly, showExistingOnly, excludeFolders }, } = this;
        const isExcludedFolder = matcherFnForRegExList(excludeFolders);
        let nodes = [vault.getRoot()];
        while (nodes.length > 0) {
            const node = nodes.pop();
            if (isTFile(node)) {
                this.addSuggestionsFromFile(inputInfo, suggestions, node, prepQuery);
            }
            else if (!isExcludedFolder(node.path)) {
                nodes = nodes.concat(node.children);
            }
        }
        if (!strictHeadingsOnly && !showExistingOnly) {
            this.addUnresolvedSuggestions(suggestions, prepQuery);
        }
        return suggestions;
    }
    addSuggestionsFromFile(inputInfo, suggestions, file, prepQuery) {
        const { searchAllHeadings, strictHeadingsOnly, shouldSearchFilenames, shouldShowAlias, } = this.settings;
        if (this.shouldIncludeFile(file)) {
            const isH1Matched = this.addHeadingSuggestions(inputInfo, suggestions, prepQuery, file, searchAllHeadings);
            if (!strictHeadingsOnly) {
                if (shouldSearchFilenames || !isH1Matched) {
                    // if strict is disabled and filename search is enabled or there
                    // isn't an H1 match, then do a fallback search against the filename, then path
                    this.addFileSuggestions(inputInfo, suggestions, prepQuery, file);
                }
                if (shouldShowAlias) {
                    this.addAliasSuggestions(inputInfo, suggestions, prepQuery, file);
                }
            }
        }
    }
    downrankScoreIfIgnored(sugg) {
        if (this.app.metadataCache.isUserIgnored(sugg?.file?.path)) {
            sugg.downranked = true;
            if (sugg.match) {
                sugg.match.score -= 10;
            }
        }
        return sugg;
    }
    shouldIncludeFile(file) {
        let retVal = false;
        const { settings: { excludeObsidianIgnoredFiles, builtInSystemOptions: { showAttachments, showAllFileTypes }, }, app: { viewRegistry, metadataCache }, } = this;
        if (isTFile(file)) {
            const { extension } = file;
            if (!metadataCache.isUserIgnored(file.path) || !excludeObsidianIgnoredFiles) {
                retVal = viewRegistry.isExtensionRegistered(extension)
                    ? showAttachments || extension === 'md'
                    : showAllFileTypes;
            }
        }
        return retVal;
    }
    addAliasSuggestions(inputInfo, suggestions, prepQuery, file) {
        const { metadataCache } = this.app;
        const frontMatter = metadataCache.getFileCache(file)?.frontmatter;
        if (frontMatter) {
            const aliases = FrontMatterParser.getAliases(frontMatter);
            let i = aliases.length;
            // create suggestions where there is a match with an alias
            while (i--) {
                const alias = aliases[i];
                const { match } = this.fuzzySearchWithFallback(prepQuery, alias);
                if (match) {
                    suggestions.push(this.createAliasSuggestion(inputInfo, alias, file, match));
                }
            }
        }
    }
    addFileSuggestions(inputInfo, suggestions, prepQuery, file) {
        const { match, matchType, matchText } = this.fuzzySearchWithFallback(prepQuery, null, file);
        if (match) {
            suggestions.push(this.createFileSuggestion(inputInfo, file, match, matchType, matchText));
        }
    }
    addHeadingSuggestions(inputInfo, suggestions, prepQuery, file, allHeadings) {
        const { metadataCache } = this.app;
        const headingList = metadataCache.getFileCache(file)?.headings ?? [];
        let h1 = null;
        let isH1Matched = false;
        let i = headingList.length;
        while (i--) {
            const heading = headingList[i];
            let isMatched = false;
            if (allHeadings) {
                isMatched = this.matchAndPushHeading(inputInfo, suggestions, prepQuery, file, heading);
            }
            if (heading.level === 1) {
                const { line } = heading.position.start;
                if (h1 === null || line < h1.position.start.line) {
                    h1 = heading;
                    isH1Matched = isMatched;
                }
            }
        }
        if (!allHeadings && h1) {
            isH1Matched = this.matchAndPushHeading(inputInfo, suggestions, prepQuery, file, h1);
        }
        return isH1Matched;
    }
    matchAndPushHeading(inputInfo, suggestions, prepQuery, file, heading) {
        const { match } = this.fuzzySearchWithFallback(prepQuery, heading.heading);
        if (match) {
            suggestions.push(this.createHeadingSuggestion(inputInfo, heading, file, match));
        }
        return !!match;
    }
    addUnresolvedSuggestions(suggestions, prepQuery) {
        const { unresolvedLinks } = this.app.metadataCache;
        const unresolvedSet = new Set();
        const sources = Object.keys(unresolvedLinks);
        let i = sources.length;
        // create a distinct list of unresolved links
        while (i--) {
            // each source has an object with keys that represent the list of unresolved links
            // for that source file
            const sourcePath = sources[i];
            const links = Object.keys(unresolvedLinks[sourcePath]);
            let j = links.length;
            while (j--) {
                // unresolved links can be duplicates, use a Set to get a distinct list
                unresolvedSet.add(links[j]);
            }
        }
        const unresolvedList = Array.from(unresolvedSet);
        i = unresolvedList.length;
        // create suggestions where there is a match with an unresolved link
        while (i--) {
            const unresolved = unresolvedList[i];
            const { match } = this.fuzzySearchWithFallback(prepQuery, unresolved);
            if (match) {
                suggestions.push(this.createUnresolvedSuggestion(unresolved, match));
            }
        }
    }
    createAliasSuggestion(inputInfo, alias, file, match) {
        const sugg = {
            alias,
            file,
            ...this.createSearchMatch(match, MatchType.Primary, alias),
            type: SuggestionType.Alias,
        };
        Handler.updateWorkspaceEnvListStatus(inputInfo.currentWorkspaceEnvList, sugg);
        return this.downrankScoreIfIgnored(sugg);
    }
    createUnresolvedSuggestion(linktext, match) {
        return {
            linktext,
            ...this.createSearchMatch(match, MatchType.Primary, linktext),
            type: SuggestionType.Unresolved,
        };
    }
    createFileSuggestion(inputInfo, file, match, matchType = MatchType.None, matchText = null) {
        const sugg = {
            file,
            match,
            matchType,
            matchText,
            type: SuggestionType.File,
        };
        Handler.updateWorkspaceEnvListStatus(inputInfo.currentWorkspaceEnvList, sugg);
        return this.downrankScoreIfIgnored(sugg);
    }
    createHeadingSuggestion(inputInfo, item, file, match) {
        const sugg = {
            item,
            file,
            ...this.createSearchMatch(match, MatchType.Primary, item.heading),
            type: SuggestionType.HeadingsList,
        };
        Handler.updateWorkspaceEnvListStatus(inputInfo.currentWorkspaceEnvList, sugg);
        return this.downrankScoreIfIgnored(sugg);
    }
    createSearchMatch(match, type, text) {
        let matchType = MatchType.None;
        let matchText = null;
        if (match) {
            matchType = type;
            matchText = text;
        }
        return {
            match,
            matchType,
            matchText,
        };
    }
    getRecentFilesSuggestions(inputInfo) {
        const suggestions = [];
        const files = inputInfo?.currentWorkspaceEnvList?.mostRecentFiles;
        files?.forEach((file) => {
            if (this.shouldIncludeFile(file)) {
                const h1 = this.getFirstH1(file);
                const sugg = h1
                    ? this.createHeadingSuggestion(inputInfo, h1, file, null)
                    : this.createFileSuggestion(inputInfo, file, null);
                sugg.isRecentOpen = true;
                suggestions.push(sugg);
            }
        });
        return suggestions;
    }
    getOpenEditorSuggestions(inputInfo) {
        const suggestions = [];
        const leaves = inputInfo?.currentWorkspaceEnvList?.openWorkspaceLeaves;
        leaves?.forEach((leaf) => {
            const file = leaf.view?.file;
            const sugg = EditorHandler.createSuggestion(inputInfo.currentWorkspaceEnvList, leaf, file, null);
            suggestions.push(sugg);
        });
        return suggestions;
    }
    getInitialSuggestionList(inputInfo) {
        const openEditors = this.getOpenEditorSuggestions(inputInfo);
        const recentFiles = this.getRecentFilesSuggestions(inputInfo);
        return [...openEditors, ...recentFiles];
    }
}

class SymbolHandler extends Handler {
    get commandString() {
        return this.settings?.symbolListCommand;
    }
    validateCommand(inputInfo, index, filterText, activeSuggestion, activeLeaf) {
        const sourceInfo = this.getSourceInfoForSymbolOperation(activeSuggestion, activeLeaf, index === 0);
        if (sourceInfo) {
            inputInfo.mode = Mode.SymbolList;
            const symbolCmd = inputInfo.parsedCommand(Mode.SymbolList);
            symbolCmd.source = sourceInfo;
            symbolCmd.index = index;
            symbolCmd.parsedInput = filterText;
            symbolCmd.isValidated = true;
        }
    }
    async getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            this.inputInfo = inputInfo;
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const symbolCmd = inputInfo.parsedCommand(Mode.SymbolList);
            const items = await this.getItems(symbolCmd.source, hasSearchTerm);
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, SymbolHandler.getSuggestionTextForSymbol(item));
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    const { file } = symbolCmd.source;
                    suggestions.push({ type: SuggestionType.SymbolList, file, item, match });
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { item } = sugg;
            const parentElClasses = ['qsp-suggestion-symbol'];
            if (this.settings.symbolsInLineOrder &&
                !this.inputInfo?.searchQuery?.hasSearchTerm) {
                parentElClasses.push(`qsp-symbol-l${item.indentLevel}`);
            }
            this.addClassesToSuggestionContainer(parentEl, parentElClasses);
            const text = SymbolHandler.getSuggestionTextForSymbol(item);
            this.renderContent(parentEl, text, sugg.match);
            this.addSymbolIndicator(item, parentEl);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const symbolCmd = this.inputInfo.parsedCommand();
            const { leaf, file } = symbolCmd.source;
            const { start: { line, col }, end: endLoc, } = sugg.item.symbol.position;
            // object containing the state information for the target editor,
            // start with the range to highlight in target editor
            const eState = {
                active: true,
                focus: true,
                startLoc: { line, col },
                endLoc,
                line,
                cursor: {
                    from: { line, ch: col },
                    to: { line, ch: col },
                },
            };
            this.navigateToLeafOrOpenFile(evt, file, `Unable to navigate to symbol for file ${file.path}`, { active: true, eState }, leaf, Mode.SymbolList);
        }
    }
    reset() {
        this.inputInfo = null;
    }
    getSourceInfoForSymbolOperation(activeSuggestion, activeLeaf, isSymbolCmdPrefix) {
        const prevInputInfo = this.inputInfo;
        let prevSourceInfo = null;
        let prevMode = Mode.Standard;
        if (prevInputInfo) {
            prevSourceInfo = prevInputInfo.parsedCommand().source;
            prevMode = prevInputInfo.mode;
        }
        // figure out if the previous operation was a symbol operation
        const hasPrevSymbolSource = prevMode === Mode.SymbolList && !!prevSourceInfo;
        const activeEditorInfo = this.getEditorInfo(activeLeaf);
        const activeSuggInfo = this.getSuggestionInfo(activeSuggestion);
        // Pick the source file for a potential symbol operation, prioritizing
        // any pre-existing symbol operation that was in progress
        let sourceInfo = null;
        if (hasPrevSymbolSource) {
            sourceInfo = prevSourceInfo;
        }
        else if (activeSuggInfo.isValidSource) {
            sourceInfo = activeSuggInfo;
        }
        else if (activeEditorInfo.isValidSource && isSymbolCmdPrefix) {
            sourceInfo = activeEditorInfo;
        }
        return sourceInfo;
    }
    async getItems(sourceInfo, hasSearchTerm) {
        let items = [];
        let symbolsInLineOrder = false;
        let selectNearestHeading = false;
        if (!hasSearchTerm) {
            ({ selectNearestHeading, symbolsInLineOrder } = this.settings);
        }
        items = await this.getSymbolsFromSource(sourceInfo, symbolsInLineOrder);
        if (selectNearestHeading) {
            SymbolHandler.FindNearestHeadingSymbol(items, sourceInfo);
        }
        return items;
    }
    static FindNearestHeadingSymbol(items, sourceInfo) {
        const cursorLine = sourceInfo?.cursor?.line;
        // find the nearest heading to the current cursor pos, if applicable
        if (cursorLine) {
            let found = null;
            const headings = items.filter((v) => isHeadingCache(v.symbol));
            if (headings.length) {
                found = headings.reduce((acc, curr) => {
                    const { line: currLine } = curr.symbol.position.start;
                    const accLine = acc ? acc.symbol.position.start.line : -1;
                    return currLine > accLine && currLine <= cursorLine ? curr : acc;
                });
            }
            if (found) {
                found.isSelected = true;
            }
        }
    }
    async getSymbolsFromSource(sourceInfo, orderByLineNumber) {
        const { app: { metadataCache }, settings, } = this;
        const ret = [];
        if (sourceInfo?.file) {
            const file = sourceInfo.file;
            const symbolData = metadataCache.getFileCache(file);
            if (symbolData) {
                const push = (symbols = [], symbolType) => {
                    if (settings.isSymbolTypeEnabled(symbolType)) {
                        symbols.forEach((symbol) => ret.push({ type: 'symbolInfo', symbol, symbolType }));
                    }
                };
                push(symbolData.headings, SymbolType.Heading);
                push(symbolData.tags, SymbolType.Tag);
                this.addLinksFromSource(symbolData.links, ret);
                push(symbolData.embeds, SymbolType.Embed);
                await this.addCalloutsFromSource(file, symbolData.sections?.filter((v) => v.type === 'callout'), ret);
            }
        }
        return orderByLineNumber ? SymbolHandler.orderSymbolsByLineNumber(ret) : ret;
    }
    async addCalloutsFromSource(file, sectionCache, symbolList) {
        const { app: { vault }, settings, } = this;
        const isCalloutEnabled = settings.isSymbolTypeEnabled(SymbolType.Callout);
        if (isCalloutEnabled && sectionCache?.length && file) {
            let fileContent = null;
            try {
                fileContent = await vault.cachedRead(file);
            }
            catch (e) {
                console.log(`Switcher++: error reading file to extract callout information. ${file.path} `, e);
            }
            if (fileContent) {
                for (const cache of sectionCache) {
                    const { start, end } = cache.position;
                    const calloutStr = fileContent.slice(start.offset, end.offset);
                    const match = calloutStr.match(/^> \[!([^\]]+)\][+-]?(.*?)(?:\n>|$)/);
                    if (match) {
                        const calloutType = match[1];
                        const calloutTitle = match[match.length - 1];
                        const symbol = {
                            calloutTitle: calloutTitle.trim(),
                            calloutType,
                            ...cache,
                        };
                        symbolList.push({
                            type: 'symbolInfo',
                            symbolType: SymbolType.Callout,
                            symbol,
                        });
                    }
                }
            }
        }
    }
    addLinksFromSource(linkData, symbolList) {
        const { settings } = this;
        linkData = linkData ?? [];
        if (settings.isSymbolTypeEnabled(SymbolType.Link)) {
            for (const link of linkData) {
                const type = getLinkType(link);
                const isExcluded = (settings.excludeLinkSubTypes & type) === type;
                if (!isExcluded) {
                    symbolList.push({
                        type: 'symbolInfo',
                        symbol: link,
                        symbolType: SymbolType.Link,
                    });
                }
            }
        }
    }
    static orderSymbolsByLineNumber(symbols) {
        const sorted = symbols.sort((a, b) => {
            const { start: aStart } = a.symbol.position;
            const { start: bStart } = b.symbol.position;
            const lineDiff = aStart.line - bStart.line;
            return lineDiff === 0 ? aStart.col - bStart.col : lineDiff;
        });
        let currIndentLevel = 0;
        sorted.forEach((si) => {
            let indentLevel = 0;
            if (isHeadingCache(si.symbol)) {
                currIndentLevel = si.symbol.level;
                indentLevel = si.symbol.level - 1;
            }
            else {
                indentLevel = currIndentLevel;
            }
            si.indentLevel = indentLevel;
        });
        return sorted;
    }
    static getSuggestionTextForSymbol(symbolInfo) {
        const { symbol } = symbolInfo;
        let text;
        if (isHeadingCache(symbol)) {
            text = symbol.heading;
        }
        else if (isTagCache(symbol)) {
            text = symbol.tag.slice(1);
        }
        else if (isCalloutCache(symbol)) {
            text = symbol.calloutTitle;
        }
        else {
            const refCache = symbol;
            ({ link: text } = refCache);
            const { displayText } = refCache;
            if (displayText && displayText !== text) {
                text += `|${displayText}`;
            }
        }
        return text;
    }
    addSymbolIndicator(symbolInfo, parentEl) {
        const { symbolType, symbol } = symbolInfo;
        const flairElClasses = ['qsp-symbol-indicator'];
        const flairContainerEl = this.createFlairContainer(parentEl);
        if (isCalloutCache(symbol)) {
            flairElClasses.push(...['suggestion-flair', 'callout', 'callout-icon', 'svg-icon']);
            const calloutFlairEl = flairContainerEl.createSpan({
                cls: flairElClasses,
                // Obsidian 0.15.9: the icon glyph is set in css based on the data-callout attr
                attr: { 'data-callout': symbol.calloutType },
            });
            // Obsidian 0.15.9 the --callout-icon css prop holds the name of the icon glyph
            const iconName = calloutFlairEl.getCssPropertyValue('--callout-icon');
            obsidian.setIcon(calloutFlairEl, iconName);
        }
        else {
            let indicator;
            if (isHeadingCache(symbol)) {
                indicator = HeadingIndicators[symbol.level];
            }
            else {
                indicator = SymbolIndicators[symbolType];
            }
            this.renderIndicator(flairContainerEl, flairElClasses, null, indicator);
        }
    }
}

const STARRED_PLUGIN_ID = 'starred';
class StarredHandler extends Handler {
    get commandString() {
        return this.settings?.starredListCommand;
    }
    validateCommand(inputInfo, index, filterText, _activeSuggestion, _activeLeaf) {
        if (this.isStarredPluginEnabled()) {
            inputInfo.mode = Mode.StarredList;
            const starredCmd = inputInfo.parsedCommand(Mode.StarredList);
            starredCmd.index = index;
            starredCmd.parsedInput = filterText;
            starredCmd.isValidated = true;
        }
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const itemsInfo = this.getItems();
            itemsInfo.forEach(({ file, item }) => {
                let shouldPush = true;
                let result = { matchType: MatchType.None, match: null };
                if (hasSearchTerm) {
                    result = this.fuzzySearchWithFallback(prepQuery, null, file);
                    shouldPush = result.matchType !== MatchType.None;
                }
                if (shouldPush) {
                    suggestions.push(StarredHandler.createSuggestion(inputInfo.currentWorkspaceEnvList, item, file, result));
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { file, matchType, match } = sugg;
            this.renderAsFileInfoPanel(parentEl, ['qsp-suggestion-starred'], null, file, matchType, match);
            this.renderOptionalIndicators(parentEl, sugg);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const { item } = sugg;
            if (isFileStarredItem(item)) {
                const { file } = sugg;
                this.navigateToLeafOrOpenFile(evt, file, `Unable to open Starred file ${file.path}`);
            }
        }
    }
    getItems() {
        const itemsInfo = [];
        const starredItems = this.getSystemStarredPluginInstance()?.items;
        if (starredItems) {
            starredItems.forEach((starredItem) => {
                // Only support displaying of starred files for now
                if (isFileStarredItem(starredItem)) {
                    const file = this.getTFileByPath(starredItem.path);
                    // 2022-apr when a starred file is deleted, the underlying data stored in the
                    // Starred plugin data file (starred.json) for that file remain in there, but
                    // at runtime the deleted file info is not displayed. Do the same here.
                    if (file) {
                        // 2022-apr when a starred file is renamed, the 'title' property stored in
                        // the underlying Starred plugin data file (starred.json) is not updated, but
                        // at runtime, the title that is displayed in the UI does reflect the updated
                        // filename. So do the same thing here in order to display the current
                        // filename as the starred file title
                        const title = file.basename;
                        const item = {
                            type: 'file',
                            title,
                            path: starredItem.path,
                        };
                        itemsInfo.push({ file, item });
                    }
                }
            });
        }
        return itemsInfo;
    }
    isStarredPluginEnabled() {
        const plugin = this.getSystemStarredPlugin();
        return plugin?.enabled;
    }
    getSystemStarredPlugin() {
        return getInternalPluginById(this.app, STARRED_PLUGIN_ID);
    }
    getSystemStarredPluginInstance() {
        const starredPlugin = this.getSystemStarredPlugin();
        return starredPlugin?.instance;
    }
    static createSuggestion(currentWorkspaceEnvList, item, file, result) {
        const sugg = {
            item,
            file,
            type: SuggestionType.StarredList,
            ...result,
        };
        return Handler.updateWorkspaceEnvListStatus(currentWorkspaceEnvList, sugg);
    }
}

const COMMAND_PALETTE_PLUGIN_ID = 'command-palette';
const recentlyUsedCommandIds = [];
class CommandHandler extends Handler {
    get commandString() {
        return this.settings?.commandListCommand;
    }
    validateCommand(inputInfo, index, filterText, _activeSuggestion, _activeLeaf) {
        inputInfo.mode = Mode.CommandList;
        const commandCmd = inputInfo.parsedCommand(Mode.CommandList);
        commandCmd.index = index;
        commandCmd.parsedInput = filterText;
        commandCmd.isValidated = true;
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const itemsInfo = this.getItems(hasSearchTerm, recentlyUsedCommandIds);
            itemsInfo.forEach(({ isPinned, isRecentOpen, cmd }) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, cmd.name);
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({
                        type: SuggestionType.CommandList,
                        item: cmd,
                        isPinned,
                        isRecentOpen,
                        match,
                    });
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { item, match, isPinned, isRecentOpen } = sugg;
            this.addClassesToSuggestionContainer(parentEl, ['qsp-suggestion-command']);
            this.renderContent(parentEl, item.name, match);
            const flairContainerEl = this.createFlairContainer(parentEl);
            this.renderHotkeyForCommand(item.id, this.app, flairContainerEl);
            if (item.icon) {
                this.renderIndicator(flairContainerEl, [], item.icon);
            }
            if (isPinned) {
                this.renderIndicator(flairContainerEl, [], 'filled-pin');
            }
            else if (isRecentOpen) {
                this.renderOptionalIndicators(parentEl, sugg, flairContainerEl);
            }
        }
    }
    renderHotkeyForCommand(id, app, flairContainerEl) {
        try {
            const hotkeyStr = app.hotkeyManager.printHotkeyForCommand(id);
            if (hotkeyStr?.length) {
                flairContainerEl.createEl('kbd', {
                    cls: 'suggestion-hotkey',
                    text: hotkeyStr,
                });
            }
        }
        catch (err) {
            console.log('Switcher++: error rendering hotkey for command id: ', id, err);
        }
    }
    onChooseSuggestion(sugg) {
        if (sugg) {
            const { item } = sugg;
            this.app.commands.executeCommandById(item.id);
            this.saveUsageToList(item.id, recentlyUsedCommandIds);
        }
    }
    saveUsageToList(commandId, recentCommandIds) {
        if (recentCommandIds) {
            const oldIndex = recentCommandIds.indexOf(commandId);
            if (oldIndex > -1) {
                recentCommandIds.splice(oldIndex, 1);
            }
            recentCommandIds.unshift(commandId);
            recentCommandIds.splice(25);
        }
    }
    getItems(includeAllCommands, recentCommandIds) {
        const { app } = this;
        const items = includeAllCommands
            ? this.getAllCommandsList(app, recentCommandIds)
            : this.getInitialCommandList(app, recentCommandIds);
        return items ?? [];
    }
    getAllCommandsList(app, recentCommandIds) {
        const pinnedIdsSet = this.getPinnedCommandIds();
        const recentIdsSet = new Set(recentCommandIds);
        return app.commands
            .listCommands()
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((cmd) => {
            return {
                isPinned: pinnedIdsSet.has(cmd.id),
                isRecentOpen: recentIdsSet.has(cmd.id),
                cmd,
            };
        });
    }
    getInitialCommandList(app, recentCommandIds) {
        const commands = [];
        const findAndAdd = (id, isPinned, isRecentOpen) => {
            const cmd = app.commands.findCommand(id);
            if (cmd) {
                commands.push({ isPinned, isRecentOpen, cmd });
            }
        };
        const pinnedCommandIds = this.getPinnedCommandIds();
        pinnedCommandIds.forEach((id) => findAndAdd(id, true, false));
        commands.sort((a, b) => a.cmd.name.localeCompare(b.cmd.name));
        // remove any pinned commands from the recently used list so they don't show up in
        // both pinned and recent sections
        recentCommandIds
            ?.filter((v) => !pinnedCommandIds.has(v))
            .forEach((id) => findAndAdd(id, false, true));
        // if there are no pinned, and no recent items, show the whole list
        return commands.length ? commands : this.getAllCommandsList(app, recentCommandIds);
    }
    getPinnedCommandIds() {
        let pinnedCommandIds;
        if (this.isCommandPalettePluginEnabled() &&
            this.getCommandPalettePluginInstance()?.options.pinned?.length) {
            pinnedCommandIds = new Set(this.getCommandPalettePluginInstance().options.pinned);
        }
        return pinnedCommandIds ?? new Set();
    }
    isCommandPalettePluginEnabled() {
        const plugin = this.getCommandPalettePlugin();
        return plugin?.enabled;
    }
    getCommandPalettePlugin() {
        return getInternalPluginById(this.app, COMMAND_PALETTE_PLUGIN_ID);
    }
    getCommandPalettePluginInstance() {
        const commandPalettePlugin = this.getCommandPalettePlugin();
        return commandPalettePlugin?.instance;
    }
}

class RelatedItemsHandler extends Handler {
    get commandString() {
        return this.settings?.relatedItemsListCommand;
    }
    validateCommand(inputInfo, index, filterText, activeSuggestion, activeLeaf) {
        const sourceInfo = this.getSourceInfo(activeSuggestion, activeLeaf, index === 0);
        if (sourceInfo) {
            inputInfo.mode = Mode.RelatedItemsList;
            const cmd = inputInfo.parsedCommand(Mode.RelatedItemsList);
            cmd.source = sourceInfo;
            cmd.index = index;
            cmd.parsedInput = filterText;
            cmd.isValidated = true;
        }
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            this.inputInfo = inputInfo;
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const cmd = inputInfo.parsedCommand(Mode.RelatedItemsList);
            const items = this.getItems(cmd.source);
            items.forEach((item) => {
                let shouldPush = true;
                let result = { matchType: MatchType.None, match: null };
                if (hasSearchTerm) {
                    result = this.fuzzySearchWithFallback(prepQuery, null, item.file);
                    shouldPush = result.matchType !== MatchType.None;
                }
                if (shouldPush) {
                    suggestions.push(RelatedItemsHandler.createSuggestion(inputInfo.currentWorkspaceEnvList, item, item.file, result));
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { file, matchType, match, item } = sugg;
            const iconMap = new Map([
                [RelationType.Backlink, 'links-coming-in'],
                [RelationType.DiskLocation, 'folder-tree'],
            ]);
            parentEl.setAttribute('data-relation-type', item.relationType);
            this.renderAsFileInfoPanel(parentEl, ['qsp-suggestion-related'], null, file, matchType, match);
            const flairContainerEl = this.createFlairContainer(parentEl);
            this.renderOptionalIndicators(parentEl, sugg, flairContainerEl);
            if (sugg.item.count) {
                // show the count of backlinks
                this.renderIndicator(flairContainerEl, [], null, `${sugg.item.count}`);
            }
            // render the flair icon
            this.renderIndicator(flairContainerEl, ['qsp-related-indicator'], iconMap.get(item.relationType));
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const { file } = sugg;
            this.navigateToLeafOrOpenFile(evt, file, `Unable to open related file ${file.path}`);
        }
    }
    getItems(sourceInfo) {
        const relatedItems = [];
        const { metadataCache } = this.app;
        const { enabledRelatedItems } = this.settings;
        const { file, suggestion } = sourceInfo;
        enabledRelatedItems.forEach((relationType) => {
            if (relationType === RelationType.Backlink) {
                let targetPath = file?.path;
                let linkMap = metadataCache.resolvedLinks;
                if (isUnresolvedSuggestion(suggestion)) {
                    targetPath = suggestion.linktext;
                    linkMap = metadataCache.unresolvedLinks;
                }
                this.addBacklinks(targetPath, linkMap, relatedItems);
            }
            else if (relationType === RelationType.DiskLocation) {
                this.addRelatedDiskFiles(file, relatedItems);
            }
        });
        return relatedItems;
    }
    addRelatedDiskFiles(sourceFile, collection) {
        const { excludeRelatedFolders, excludeOpenRelatedFiles } = this.settings;
        if (sourceFile) {
            const isExcludedFolder = matcherFnForRegExList(excludeRelatedFolders);
            let nodes = [...sourceFile.parent.children];
            while (nodes.length > 0) {
                const node = nodes.pop();
                if (isTFile(node)) {
                    const isSourceFile = node === sourceFile;
                    const isExcluded = isSourceFile ||
                        (excludeOpenRelatedFiles && !!this.findMatchingLeaf(node).leaf);
                    if (!isExcluded) {
                        collection.push({ file: node, relationType: RelationType.DiskLocation });
                    }
                }
                else if (!isExcludedFolder(node.path)) {
                    nodes = nodes.concat(node.children);
                }
            }
        }
    }
    addBacklinks(targetPath, linkMap, collection) {
        for (const [originFilePath, destPathMap] of Object.entries(linkMap)) {
            if (originFilePath !== targetPath &&
                Object.prototype.hasOwnProperty.call(destPathMap, targetPath)) {
                const count = destPathMap[targetPath];
                const originFile = this.getTFileByPath(originFilePath);
                if (originFile) {
                    collection.push({
                        count,
                        file: originFile,
                        relationType: RelationType.Backlink,
                    });
                }
            }
        }
    }
    reset() {
        this.inputInfo = null;
    }
    getSourceInfo(activeSuggestion, activeLeaf, isPrefixCmd) {
        const prevInputInfo = this.inputInfo;
        let prevSourceInfo = null;
        let prevMode = Mode.Standard;
        if (prevInputInfo) {
            prevSourceInfo = prevInputInfo.parsedCommand().source;
            prevMode = prevInputInfo.mode;
        }
        // figure out if the previous operation was a symbol operation
        const hasPrevSource = prevMode === Mode.RelatedItemsList && !!prevSourceInfo;
        const activeEditorInfo = this.getEditorInfo(activeLeaf);
        const activeSuggInfo = this.getSuggestionInfo(activeSuggestion);
        if (!activeSuggInfo.isValidSource && isUnresolvedSuggestion(activeSuggestion)) {
            // related items supports retrieving backlinks for unresolved suggestion, so
            // force UnresolvedSuggestion to be valid, even though it would otherwise not be
            activeSuggInfo.isValidSource = true;
        }
        // Pick the source file for the operation, prioritizing
        // any pre-existing operation that was in progress
        let sourceInfo = null;
        if (hasPrevSource) {
            sourceInfo = prevSourceInfo;
        }
        else if (activeSuggInfo.isValidSource) {
            sourceInfo = activeSuggInfo;
        }
        else if (activeEditorInfo.isValidSource && isPrefixCmd) {
            sourceInfo = activeEditorInfo;
        }
        return sourceInfo;
    }
    static createSuggestion(currentWorkspaceEnvList, item, file, result) {
        const sugg = {
            item,
            file: file,
            type: SuggestionType.RelatedItemsList,
            ...result,
        };
        return Handler.updateWorkspaceEnvListStatus(currentWorkspaceEnvList, sugg);
    }
}

class StandardExHandler extends Handler {
    validateCommand(_inputInfo, _index, _filterText, _activeSuggestion, _activeLeaf) {
        throw new Error('Method not implemented.');
    }
    getSuggestions(_inputInfo) {
        throw new Error('Method not implemented.');
    }
    renderSuggestion(sugg, parentEl) {
        if (isFileSuggestion(sugg)) {
            this.renderFileSuggestion(sugg, parentEl);
        }
        else {
            this.renderAliasSuggestion(sugg, parentEl);
        }
        if (sugg?.downranked) {
            parentEl.addClass('mod-downranked');
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const { file } = sugg;
            this.navigateToLeafOrOpenFile(evt, file, `Unable to open file from SystemSuggestion ${file.path}`);
        }
    }
    renderFileSuggestion(sugg, parentEl) {
        if (sugg) {
            const { file, matchType, match } = sugg;
            this.renderAsFileInfoPanel(parentEl, ['qsp-suggestion-file'], null, file, matchType, match);
            this.renderOptionalIndicators(parentEl, sugg);
        }
    }
    renderAliasSuggestion(sugg, parentEl) {
        if (sugg) {
            const { file, matchType, match } = sugg;
            this.renderAsFileInfoPanel(parentEl, ['qsp-suggestion-alias'], sugg.alias, file, matchType, match, false);
            const flairContainerEl = this.renderOptionalIndicators(parentEl, sugg);
            this.renderIndicator(flairContainerEl, ['qsp-alias-indicator'], 'lucide-forward');
        }
    }
    addPropertiesToStandardSuggestions(inputInfo, sugg) {
        const { match, file } = sugg;
        const matches = match?.matches;
        let matchType = MatchType.None;
        let matchText = null;
        if (matches) {
            if (isAliasSuggestion(sugg)) {
                matchType = MatchType.Primary;
                matchText = sugg.alias;
            }
            else {
                matchType = MatchType.Path;
                matchText = file?.path;
            }
        }
        sugg.matchType = matchType;
        sugg.matchText = matchText;
        // patch with missing properties required for enhanced custom rendering
        Handler.updateWorkspaceEnvListStatus(inputInfo.currentWorkspaceEnvList, sugg);
    }
}

class InputInfo {
    constructor(inputText = '', mode = Mode.Standard) {
        this.inputText = inputText;
        this.mode = mode;
        this.currentWorkspaceEnvList = {
            openWorkspaceLeaves: new Set(),
            openWorkspaceFiles: new Set(),
            starredFiles: new Set(),
            mostRecentFiles: new Set(),
        };
        const symbolListCmd = {
            ...InputInfo.defaultParsedCommand,
            source: null,
        };
        const relatedItemsListCmd = {
            ...InputInfo.defaultParsedCommand,
            source: null,
        };
        const parsedCmds = {};
        parsedCmds[Mode.SymbolList] = symbolListCmd;
        parsedCmds[Mode.Standard] = InputInfo.defaultParsedCommand;
        parsedCmds[Mode.EditorList] = InputInfo.defaultParsedCommand;
        parsedCmds[Mode.WorkspaceList] = InputInfo.defaultParsedCommand;
        parsedCmds[Mode.HeadingsList] = InputInfo.defaultParsedCommand;
        parsedCmds[Mode.StarredList] = InputInfo.defaultParsedCommand;
        parsedCmds[Mode.CommandList] = InputInfo.defaultParsedCommand;
        parsedCmds[Mode.RelatedItemsList] = relatedItemsListCmd;
        this.parsedCommands = parsedCmds;
    }
    static get defaultParsedCommand() {
        return {
            isValidated: false,
            index: -1,
            parsedInput: null,
        };
    }
    get searchQuery() {
        return this._searchQuery;
    }
    buildSearchQuery() {
        const { mode } = this;
        const input = this.parsedCommands[mode].parsedInput ?? '';
        const prepQuery = obsidian.prepareQuery(input.trim().toLowerCase());
        const hasSearchTerm = prepQuery?.query?.length > 0;
        this._searchQuery = { prepQuery, hasSearchTerm };
    }
    parsedCommand(mode) {
        mode = mode ?? this.mode;
        return this.parsedCommands[mode];
    }
}

class ModeHandler {
    constructor(app, settings, exKeymap) {
        this.app = app;
        this.settings = settings;
        this.exKeymap = exKeymap;
        // StandardExHandler one is special in that it is not a "full" handler,
        // and not attached to a mode, as a result it is not in the handlersByMode list
        const standardExHandler = new StandardExHandler(app, settings);
        const handlersByMode = new Map([
            [Mode.SymbolList, new SymbolHandler(app, settings)],
            [Mode.WorkspaceList, new WorkspaceHandler(app, settings)],
            [Mode.HeadingsList, new HeadingsHandler(app, settings)],
            [Mode.EditorList, new EditorHandler(app, settings)],
            [Mode.StarredList, new StarredHandler(app, settings)],
            [Mode.CommandList, new CommandHandler(app, settings)],
            [Mode.RelatedItemsList, new RelatedItemsHandler(app, settings)],
        ]);
        this.handlersByMode = handlersByMode;
        this.handlersByType = new Map([
            [SuggestionType.CommandList, handlersByMode.get(Mode.CommandList)],
            [SuggestionType.EditorList, handlersByMode.get(Mode.EditorList)],
            [SuggestionType.HeadingsList, handlersByMode.get(Mode.HeadingsList)],
            [SuggestionType.RelatedItemsList, handlersByMode.get(Mode.RelatedItemsList)],
            [SuggestionType.StarredList, handlersByMode.get(Mode.StarredList)],
            [SuggestionType.SymbolList, handlersByMode.get(Mode.SymbolList)],
            [SuggestionType.WorkspaceList, handlersByMode.get(Mode.WorkspaceList)],
            [SuggestionType.File, standardExHandler],
            [SuggestionType.Alias, standardExHandler],
        ]);
        this.debouncedGetSuggestions = obsidian.debounce(this.getSuggestions.bind(this), 400, true);
        this.reset();
    }
    onOpen() {
        this.exKeymap.isOpen = true;
    }
    onClose() {
        this.exKeymap.isOpen = false;
    }
    setSessionOpenMode(mode, chooser) {
        this.reset();
        chooser?.setSuggestions([]);
        if (mode !== Mode.Standard) {
            this.sessionOpenModeString = this.getHandler(mode).commandString;
        }
    }
    insertSessionOpenModeCommandString(inputEl) {
        const { sessionOpenModeString } = this;
        if (sessionOpenModeString !== null && sessionOpenModeString !== '') {
            // update UI with current command string in the case were openInMode was called
            inputEl.value = sessionOpenModeString;
            // reset to null so user input is not overridden the next time onInput is called
            this.sessionOpenModeString = null;
        }
    }
    updateSuggestions(query, chooser, modal) {
        let handled = false;
        const { exKeymap } = this;
        // cancel any potentially previously running debounced getsuggestions call
        this.debouncedGetSuggestions.cancel();
        // get the currently active leaf across all rootSplits
        const activeLeaf = Handler.getActiveLeaf(this.app.workspace);
        const activeSugg = ModeHandler.getActiveSuggestion(chooser);
        const inputInfo = this.determineRunMode(query, activeSugg, activeLeaf);
        this.inputInfo = inputInfo;
        const { mode } = inputInfo;
        exKeymap.updateKeymapForMode(mode);
        if (mode !== Mode.Standard) {
            if (mode === Mode.HeadingsList && inputInfo.parsedCommand().parsedInput?.length) {
                // if headings mode and user is typing a query, delay getting suggestions
                this.debouncedGetSuggestions(inputInfo, chooser, modal);
            }
            else {
                this.getSuggestions(inputInfo, chooser, modal);
            }
            handled = true;
        }
        return handled;
    }
    renderSuggestion(sugg, parentEl) {
        const { inputInfo, settings: { overrideStandardModeBehaviors }, } = this;
        const { mode } = inputInfo;
        const isHeadingMode = mode === Mode.HeadingsList;
        let handled = false;
        if (sugg === null) {
            if (isHeadingMode) {
                // in Headings mode, a null suggestion should be rendered to allow for note creation
                const headingHandler = this.getHandler(mode);
                const searchText = inputInfo.parsedCommand(mode)?.parsedInput;
                headingHandler.renderFileCreationSuggestion(parentEl, searchText);
                handled = true;
            }
        }
        else if (!isUnresolvedSuggestion(sugg)) {
            if (overrideStandardModeBehaviors || isHeadingMode || isExSuggestion(sugg)) {
                // when overriding standard mode, or, in Headings mode, StandardExHandler should
                // handle rendering for FileSuggestion and Alias suggestion
                const handler = this.getHandler(sugg);
                if (mode === Mode.Standard) {
                    // suggestions in standard mode are created by core Obsidian and are
                    // missing some properties, try to add them
                    handler?.addPropertiesToStandardSuggestions(inputInfo, sugg);
                }
                handler.renderSuggestion(sugg, parentEl);
                handled = true;
            }
        }
        return handled;
    }
    onChooseSuggestion(sugg, evt) {
        const { inputInfo, settings: { overrideStandardModeBehaviors }, } = this;
        const { mode } = inputInfo;
        const isHeadingMode = mode === Mode.HeadingsList;
        let handled = false;
        if (sugg === null) {
            if (isHeadingMode) {
                // in Headings mode, a null suggestion should create a new note
                const headingHandler = this.getHandler(mode);
                const filename = inputInfo.parsedCommand(mode)?.parsedInput;
                headingHandler.createFile(filename, evt);
                handled = true;
            }
        }
        else if (!isUnresolvedSuggestion(sugg)) {
            if (overrideStandardModeBehaviors || isHeadingMode || isExSuggestion(sugg)) {
                // when overriding standard mode, or, in Headings mode, StandardExHandler should
                // handle the onChoose action for File and Alias suggestion so that
                // the preferOpenInNewPane setting can be handled properly
                const handler = this.getHandler(sugg);
                handler.onChooseSuggestion(sugg, evt);
                handled = true;
            }
        }
        return handled;
    }
    determineRunMode(query, activeSugg, activeLeaf) {
        const input = query ?? '';
        const info = this.addWorkspaceEnvLists(new InputInfo(input));
        if (input.length === 0) {
            this.reset();
        }
        this.validatePrefixCommands(info, activeSugg, activeLeaf);
        this.validateSourcedCommands(info, activeSugg, activeLeaf);
        return info;
    }
    getSuggestions(inputInfo, chooser, modal) {
        chooser.setSuggestions([]);
        const { mode } = inputInfo;
        const suggestions = this.getHandler(mode).getSuggestions(inputInfo);
        const setSuggestions = (suggs) => {
            if (suggs?.length) {
                chooser.setSuggestions(suggs);
                ModeHandler.setActiveSuggestion(mode, chooser);
            }
            else {
                if (mode === Mode.HeadingsList && inputInfo.parsedCommand(mode).parsedInput) {
                    modal.onNoSuggestion();
                }
                else {
                    chooser.setSuggestions(null);
                }
            }
        };
        if (Array.isArray(suggestions)) {
            setSuggestions(suggestions);
        }
        else {
            suggestions.then((values) => {
                setSuggestions(values);
            }, (reason) => {
                console.log('Switcher++: error retrieving suggestions as Promise. ', reason);
            });
        }
    }
    validatePrefixCommands(inputInfo, activeSugg, activeLeaf) {
        const { settings } = this;
        const prefixCmds = [
            settings.editorListCommand,
            settings.workspaceListCommand,
            settings.headingsListCommand,
            settings.starredListCommand,
            settings.commandListCommand,
        ]
            .map((v) => `(${escapeRegExp(v)})`)
            // account for potential overlapping command strings
            .sort((a, b) => b.length - a.length);
        // regex that matches any of the prefix commands, and extract filter text
        const match = new RegExp(`^(${prefixCmds.join('|')})(.*)$`).exec(inputInfo.inputText);
        if (match) {
            const cmdStr = match[1];
            const filterText = match[match.length - 1];
            const handler = this.getHandler(cmdStr);
            if (handler) {
                handler.validateCommand(inputInfo, match.index, filterText, activeSugg, activeLeaf);
            }
        }
    }
    validateSourcedCommands(inputInfo, activeSugg, activeLeaf) {
        const { mode, inputText } = inputInfo;
        const unmatchedHandlers = [];
        // Standard, Headings, Starred, and EditorList mode can have an embedded command
        const supportedModes = [
            Mode.Standard,
            Mode.EditorList,
            Mode.HeadingsList,
            Mode.StarredList,
        ];
        if (supportedModes.includes(mode)) {
            const { settings } = this;
            const embeddedCmds = [settings.symbolListCommand, settings.relatedItemsListCommand]
                .map((v) => `(${escapeRegExp(v)})`)
                .sort((a, b) => b.length - a.length);
            // regex that matches any sourced command, and extract filter text
            const match = new RegExp(`(${embeddedCmds.join('|')})(.*)$`).exec(inputText);
            if (match) {
                const cmdStr = match[1];
                const filterText = match[match.length - 1];
                const handler = this.getHandler(cmdStr);
                if (handler) {
                    handler.validateCommand(inputInfo, match.index, filterText, activeSugg, activeLeaf);
                }
                // find all sourced handlers that did not match
                unmatchedHandlers.push(...this.getSourcedHandlers().filter((v) => v != handler));
            }
        }
        // if unmatchedHandlers has items then there was a match, so reset all others
        // otherwise reset all sourced handlers
        this.resetSourcedHandlers(unmatchedHandlers.length ? unmatchedHandlers : null);
    }
    static setActiveSuggestion(mode, chooser) {
        // only symbol mode currently sets an active selection
        if (mode === Mode.SymbolList) {
            const index = chooser.values
                .filter((v) => isSymbolSuggestion(v))
                .findIndex((v) => v.item.isSelected);
            if (index !== -1) {
                chooser.setSelectedItem(index, null);
                chooser.suggestions[chooser.selectedItem].scrollIntoView(false);
            }
        }
    }
    static getActiveSuggestion(chooser) {
        let activeSuggestion = null;
        if (chooser?.values) {
            activeSuggestion = chooser.values[chooser.selectedItem];
        }
        return activeSuggestion;
    }
    reset() {
        this.inputInfo = new InputInfo();
        this.sessionOpenModeString = null;
        this.resetSourcedHandlers();
    }
    resetSourcedHandlers(handlers) {
        handlers = handlers ?? this.getSourcedHandlers();
        handlers.forEach((handler) => handler?.reset());
    }
    getSourcedHandlers() {
        const sourcedModes = [Mode.RelatedItemsList, Mode.SymbolList];
        return sourcedModes.map((v) => this.getHandler(v));
    }
    addWorkspaceEnvLists(inputInfo) {
        if (inputInfo) {
            const openEditors = this.getHandler(Mode.EditorList).getItems();
            const openEditorFiles = openEditors.map((v) => v?.view?.file);
            const starredFiles = this.getHandler(Mode.StarredList)
                .getItems()
                .filter((v) => isFileStarredItem(v.item) && v.file)
                .map((v) => v.file);
            const lists = inputInfo.currentWorkspaceEnvList;
            lists.openWorkspaceLeaves = new Set(openEditors);
            lists.openWorkspaceFiles = new Set(openEditorFiles);
            lists.starredFiles = new Set(starredFiles);
            lists.mostRecentFiles = this.getRecentFiles(new Set(openEditorFiles));
        }
        return inputInfo;
    }
    getRecentFiles(ignoreFiles) {
        const recentFiles = new Set();
        const { workspace, vault } = this.app;
        const recentFilePaths = workspace.getLastOpenFiles();
        ignoreFiles = ignoreFiles ?? new Set();
        recentFilePaths?.forEach((path) => {
            const file = vault.getAbstractFileByPath(path);
            if (isTFile(file) && !ignoreFiles.has(file)) {
                recentFiles.add(file);
            }
        });
        return recentFiles;
    }
    getHandler(kind) {
        let handler;
        const { handlersByMode, handlersByType } = this;
        if (typeof kind === 'number') {
            handler = handlersByMode.get(kind);
        }
        else if (isOfType(kind, 'type')) {
            handler = handlersByType.get(kind.type);
        }
        else if (typeof kind === 'string') {
            const { settings } = this;
            const handlersByCommand = new Map([
                [settings.editorListCommand, handlersByMode.get(Mode.EditorList)],
                [settings.workspaceListCommand, handlersByMode.get(Mode.WorkspaceList)],
                [settings.headingsListCommand, handlersByMode.get(Mode.HeadingsList)],
                [settings.starredListCommand, handlersByMode.get(Mode.StarredList)],
                [settings.commandListCommand, handlersByMode.get(Mode.CommandList)],
                [settings.symbolListCommand, handlersByMode.get(Mode.SymbolList)],
                [settings.relatedItemsListCommand, handlersByMode.get(Mode.RelatedItemsList)],
            ]);
            handler = handlersByCommand.get(kind);
        }
        return handler;
    }
}

class SwitcherPlusKeymap {
    constructor(scope, chooser, modal) {
        this.scope = scope;
        this.chooser = chooser;
        this.modal = modal;
        this.standardKeysInfo = [];
        this.customKeysInfo = [];
        this.savedStandardKeysInfo = [];
        this.standardInstructionsElSelector = '.prompt-instructions';
        this.standardInstructionsElDataValue = 'standard';
        this.modKey = 'Ctrl';
        this.modKeyText = 'ctrl';
        this.shiftText = 'shift';
        if (obsidian.Platform.isMacOS) {
            this.modKey = 'Meta';
            this.modKeyText = '⌘';
            this.shiftText = '⇧';
        }
        this.initKeysInfo();
        this.registerNavigationBindings(scope);
        this.registerTabBindings(scope);
        this.addDataAttrToInstructionsEl(modal.containerEl, this.standardInstructionsElSelector, this.standardInstructionsElDataValue);
    }
    get isOpen() {
        return this._isOpen;
    }
    set isOpen(value) {
        this._isOpen = value;
    }
    initKeysInfo() {
        const customFileBasedModes = [
            Mode.EditorList,
            Mode.HeadingsList,
            Mode.RelatedItemsList,
            Mode.StarredList,
            Mode.SymbolList,
        ];
        // standard mode keys that are registered by default, and
        // should be unregistered in custom modes, then re-registered in standard mode
        // example: { modifiers: 'Shift', key: 'Enter' }
        const standardKeysInfo = [];
        // custom mode keys that should be registered, then unregistered in standard mode
        // Note: modifiers should be a comma separated string of Modifiers
        // without any padding space characters
        const customKeysInfo = [
            {
                isInstructionOnly: true,
                modes: customFileBasedModes,
                modifiers: null,
                key: null,
                func: null,
                command: `${this.modKeyText} ↵`,
                purpose: 'open in new tab',
            },
            {
                isInstructionOnly: true,
                modes: customFileBasedModes,
                modifiers: this.modKey,
                key: '\\',
                func: null,
                command: `${this.modKeyText} \\`,
                purpose: 'open to the right',
            },
            {
                isInstructionOnly: true,
                modes: customFileBasedModes,
                modifiers: `${this.modKey},Shift`,
                key: '\\',
                func: null,
                command: `${this.modKeyText} ${this.shiftText} \\`,
                purpose: 'open below',
            },
            {
                isInstructionOnly: true,
                modes: customFileBasedModes,
                modifiers: this.modKey,
                key: 'o',
                func: null,
                command: `${this.modKeyText} o`,
                purpose: 'open in new window',
            },
            {
                isInstructionOnly: true,
                modes: [Mode.CommandList],
                modifiers: null,
                key: null,
                func: null,
                command: `↵`,
                purpose: 'execute command',
            },
            {
                isInstructionOnly: true,
                modes: [Mode.WorkspaceList],
                modifiers: null,
                key: null,
                func: null,
                command: `↵`,
                purpose: 'open workspace',
            },
        ];
        this.standardKeysInfo.push(...standardKeysInfo);
        this.customKeysInfo.push(...customKeysInfo);
    }
    registerNavigationBindings(scope) {
        const keys = [
            [['Ctrl'], 'n'],
            [['Ctrl'], 'p'],
            [['Ctrl'], 'j'],
            [['Ctrl'], 'k'],
        ];
        keys.forEach((v) => {
            scope.register(v[0], v[1], this.navigateItems.bind(this));
        });
    }
    registerTabBindings(scope) {
        const keys = [
            [[this.modKey], '\\'],
            [[this.modKey, 'Shift'], '\\'],
            [[this.modKey], 'o'],
        ];
        keys.forEach((v) => {
            scope.register(v[0], v[1], this.useSelectedItem.bind(this));
        });
    }
    updateKeymapForMode(mode) {
        const isStandardMode = mode === Mode.Standard;
        const { modal, scope, savedStandardKeysInfo, standardKeysInfo, customKeysInfo } = this;
        const customKeymaps = customKeysInfo.filter((v) => !v.isInstructionOnly);
        this.unregisterKeys(scope, customKeymaps);
        if (isStandardMode) {
            this.registerKeys(scope, savedStandardKeysInfo);
            savedStandardKeysInfo.length = 0;
            this.toggleStandardInstructions(modal.containerEl, true);
        }
        else {
            const standardKeysRemoved = this.unregisterKeys(scope, standardKeysInfo);
            if (standardKeysRemoved.length) {
                savedStandardKeysInfo.push(...standardKeysRemoved);
            }
            const customKeysToAdd = customKeymaps.filter((v) => v.modes?.includes(mode));
            this.registerKeys(scope, customKeysToAdd);
            this.showCustomInstructions(modal, customKeysInfo, mode);
        }
    }
    registerKeys(scope, keymaps) {
        keymaps.forEach((keymap) => {
            const modifiers = keymap.modifiers.split(',');
            scope.register(modifiers, keymap.key, keymap.func);
        });
    }
    unregisterKeys(scope, keyInfo) {
        const keysToRemove = [...keyInfo];
        const removed = [];
        let i = scope.keys.length;
        while (i--) {
            const keymap = scope.keys[i];
            const foundIndex = keysToRemove.findIndex((kInfo) => kInfo.modifiers === keymap.modifiers && kInfo.key === keymap.key);
            if (foundIndex >= 0) {
                scope.unregister(keymap);
                removed.push(keymap);
                keysToRemove.splice(foundIndex, 1);
            }
        }
        return removed;
    }
    addDataAttrToInstructionsEl(containerEl, selector, value) {
        const el = containerEl.querySelector(selector);
        el?.setAttribute('data-mode', value);
        return el;
    }
    clearCustomInstructions(containerEl) {
        const { standardInstructionsElSelector, standardInstructionsElDataValue } = this;
        const selector = `${standardInstructionsElSelector}:not([data-mode="${standardInstructionsElDataValue}"])`;
        const elements = containerEl.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
    }
    toggleStandardInstructions(containerEl, shouldShow) {
        const { standardInstructionsElSelector } = this;
        let displayValue = 'none';
        if (shouldShow) {
            displayValue = '';
            this.clearCustomInstructions(containerEl);
        }
        const el = containerEl.querySelector(standardInstructionsElSelector);
        if (el) {
            el.style.display = displayValue;
        }
    }
    showCustomInstructions(modal, keymapInfo, mode) {
        const { containerEl } = modal;
        const keymaps = keymapInfo.filter((keymap) => keymap.modes?.includes(mode));
        this.toggleStandardInstructions(containerEl, false);
        this.clearCustomInstructions(containerEl);
        modal.setInstructions(keymaps);
    }
    useSelectedItem(evt, _ctx) {
        this.chooser.useSelectedItem(evt);
    }
    navigateItems(evt, ctx) {
        const { isOpen, chooser } = this;
        if (isOpen) {
            const nextKeys = ['n', 'j'];
            let index = chooser.selectedItem;
            index = nextKeys.includes(ctx.key) ? ++index : --index;
            chooser.setSelectedItem(index, evt);
        }
        return false;
    }
}

function createSwitcherPlus(app, plugin) {
    const SystemSwitcherModal = getSystemSwitcherInstance(app)
        ?.QuickSwitcherModal;
    if (!SystemSwitcherModal) {
        console.log('Switcher++: unable to extend system switcher. Plugin UI will not be loaded. Use the builtin switcher instead.');
        return null;
    }
    const SwitcherPlusModal = class extends SystemSwitcherModal {
        constructor(app, plugin) {
            super(app, plugin.options.builtInSystemOptions);
            this.plugin = plugin;
            plugin.options.shouldShowAlias = this.shouldShowAlias;
            const exKeymap = new SwitcherPlusKeymap(this.scope, this.chooser, this);
            this.exMode = new ModeHandler(app, plugin.options, exKeymap);
        }
        openInMode(mode) {
            this.exMode.setSessionOpenMode(mode, this.chooser);
            super.open();
        }
        onOpen() {
            this.exMode.onOpen();
            super.onOpen();
        }
        onClose() {
            super.onClose();
            this.exMode.onClose();
        }
        updateSuggestions() {
            const { exMode, inputEl, chooser } = this;
            exMode.insertSessionOpenModeCommandString(inputEl);
            if (!exMode.updateSuggestions(inputEl.value, chooser, this)) {
                super.updateSuggestions();
            }
        }
        onChooseSuggestion(item, evt) {
            if (!this.exMode.onChooseSuggestion(item, evt)) {
                super.onChooseSuggestion(item, evt);
            }
        }
        renderSuggestion(value, parentEl) {
            if (!this.exMode.renderSuggestion(value, parentEl)) {
                super.renderSuggestion(value, parentEl);
            }
        }
    };
    return new SwitcherPlusModal(app, plugin);
}

class SwitcherPlusPlugin extends obsidian.Plugin {
    async onload() {
        const options = new SwitcherPlusSettings(this);
        await options.loadSettings();
        this.options = options;
        this.addSettingTab(new SwitcherPlusSettingTab(this.app, this, options));
        this.registerCommand('switcher-plus:open', 'Open', Mode.Standard);
        this.registerCommand('switcher-plus:open-editors', 'Open in Editor Mode', Mode.EditorList, 'lucide-file-edit');
        this.registerCommand('switcher-plus:open-symbols', 'Open Symbols for the active editor', Mode.SymbolList, 'lucide-dollar-sign');
        this.registerCommand('switcher-plus:open-workspaces', 'Open in Workspaces Mode', Mode.WorkspaceList, 'lucide-album');
        this.registerCommand('switcher-plus:open-headings', 'Open in Headings Mode', Mode.HeadingsList, 'lucide-file-search');
        this.registerCommand('switcher-plus:open-starred', 'Open in Starred Mode', Mode.StarredList, 'star');
        this.registerCommand('switcher-plus:open-commands', 'Open in Commands Mode', Mode.CommandList, 'run-command');
        this.registerCommand('switcher-plus:open-related-items', 'Open Related Items for the active editor', Mode.RelatedItemsList, 'lucide-file-plus-2');
    }
    registerCommand(id, name, mode, iconId) {
        this.addCommand({
            id,
            name,
            icon: iconId,
            hotkeys: [],
            checkCallback: (checking) => {
                // modal needs to be created dynamically (same as system switcher)
                // as system options are evaluated in the modal constructor
                const modal = createSwitcherPlus(this.app, this);
                if (modal) {
                    if (!checking) {
                        modal.openInMode(mode);
                    }
                    return true;
                }
                return false;
            },
        });
    }
}

module.exports = SwitcherPlusPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R5cGVzL3NoYXJlZFR5cGVzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL3V0aWxzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2Zyb250TWF0dGVyUGFyc2VyLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdzLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3NldHRpbmdzVGFiU2VjdGlvbi50cyIsIi4uLy4uL3NyYy9zZXR0aW5ncy9zdGFycmVkU2V0dGluZ3NUYWJTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL2NvbW1hbmRMaXN0U2V0dGluZ3NUYWJTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3JlbGF0ZWRJdGVtc1NldHRpbmdzVGFiU2VjdGlvbi50cyIsIi4uLy4uL3NyYy9zZXR0aW5ncy9nZW5lcmFsU2V0dGluZ3NUYWJTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3dvcmtzcGFjZVNldHRpbmdzVGFiU2VjdGlvbi50cyIsIi4uLy4uL3NyYy9zZXR0aW5ncy9lZGl0b3JTZXR0aW5nc1RhYlNlY3Rpb24udHMiLCIuLi8uLi9zcmMvc2V0dGluZ3MvaGVhZGluZ3NTZXR0aW5nc1RhYlNlY3Rpb24udHMiLCIuLi8uLi9zcmMvc2V0dGluZ3Mvc3ltYm9sU2V0dGluZ3NUYWJTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdUYWIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvaGFuZGxlci50cyIsIi4uLy4uL3NyYy9IYW5kbGVycy93b3Jrc3BhY2VIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL0hhbmRsZXJzL2VkaXRvckhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvaGVhZGluZ3NIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL0hhbmRsZXJzL3N5bWJvbEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvc3RhcnJlZEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvY29tbWFuZEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvcmVsYXRlZEl0ZW1zSGFuZGxlci50cyIsIi4uLy4uL3NyYy9IYW5kbGVycy9zdGFuZGFyZEV4SGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvaW5wdXRJbmZvLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9tb2RlSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvc3dpdGNoZXJQbHVzS2V5bWFwLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9zd2l0Y2hlclBsdXMudHMiLCIuLi8uLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiU2V0dGluZyIsIk1vZGFsIiwiUGx1Z2luU2V0dGluZ1RhYiIsIktleW1hcCIsIlBsYXRmb3JtIiwic2V0SWNvbiIsInJlbmRlclJlc3VsdHMiLCJub3JtYWxpemVQYXRoIiwiZnV6enlTZWFyY2giLCJWaWV3IiwiRmlsZVZpZXciLCJzb3J0U2VhcmNoUmVzdWx0cyIsInByZXBhcmVRdWVyeSIsImRlYm91bmNlIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBc0JBLElBQVksaUJBTVgsQ0FBQTtBQU5ELENBQUEsVUFBWSxpQkFBaUIsRUFBQTtBQUMzQixJQUFBLGlCQUFBLENBQUEsaUJBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxNQUFJLENBQUE7QUFDSixJQUFBLGlCQUFBLENBQUEsaUJBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxNQUFJLENBQUE7QUFDSixJQUFBLGlCQUFBLENBQUEsaUJBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxZQUFVLENBQUE7QUFDVixJQUFBLGlCQUFBLENBQUEsaUJBQUEsQ0FBQSxvQkFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsb0JBQWtCLENBQUE7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
