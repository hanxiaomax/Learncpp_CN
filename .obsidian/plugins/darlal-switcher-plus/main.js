'use strict';

var obsidian = require('obsidian');

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
    return isOfType(obj, 'type', 'symbol');
}
function isEditorSuggestion(obj) {
    return isOfType(obj, 'type', 'editor');
}
function isWorkspaceSuggestion(obj) {
    return isOfType(obj, 'type', 'workspace');
}
function isHeadingSuggestion(obj) {
    return isOfType(obj, 'type', 'heading');
}
function isStarredSuggestion(obj) {
    return isOfType(obj, 'type', 'starred');
}
function isCommandSuggestion(obj) {
    return isOfType(obj, 'type', 'command');
}
function isRelatedItemsSuggestion(obj) {
    return isOfType(obj, 'type', 'relatedItems');
}
function isFileSuggestion(obj) {
    return isOfType(obj, 'type', 'file');
}
function isAliasSuggestion(obj) {
    return isOfType(obj, 'type', 'alias');
}
function isUnresolvedSuggestion(obj) {
    return isOfType(obj, 'type', 'unresolved');
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

function isMainPanelLeaf(workspace, leaf) {
    return leaf?.getRoot() === workspace.rootSplit;
}
function activateLeaf(workspace, leaf, pushHistory, eState) {
    const isInSidePanel = !isMainPanelLeaf(workspace, leaf);
    const state = { focus: true, ...eState };
    if (isInSidePanel) {
        workspace.revealLeaf(leaf);
    }
    workspace.setActiveLeaf(leaf, pushHistory);
    leaf.view.setEphemeralState(state);
}
function getOpenLeaves(workspace, excludeMainPanelViewTypes, includeSidePanelViewTypes) {
    const leaves = [];
    const saveLeaf = (l) => {
        const viewType = l.view?.getViewType();
        if (isMainPanelLeaf(workspace, l)) {
            if (!excludeMainPanelViewTypes?.includes(viewType)) {
                leaves.push(l);
            }
        }
        else if (includeSidePanelViewTypes?.includes(viewType)) {
            leaves.push(l);
        }
    };
    workspace.iterateAllLeaves(saveLeaf);
    return leaves;
}
/**
 * Loads a file into a (optionally new) WorkspaceLeaf
 * @param  {Workspace} workspace
 * @param  {TFile} file
 * @param  {boolean} shouldCreateNewLeaf
 * @param  {OpenViewState} openState?
 * @param  {} errorContext=''
 * @returns void
 */
function openFileInLeaf(workspace, file, shouldCreateNewLeaf, openState, errorContext = '') {
    const message = `Switcher++: error opening file. ${errorContext}`;
    try {
        workspace
            .getLeaf(shouldCreateNewLeaf)
            .openFile(file, openState)
            .catch((reason) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            console.log(`${message} ${reason}`);
        });
    }
    catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`${message} ${error}`);
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
        return {
            alwaysNewPaneForSymbols: false,
            useActivePaneForSymbolsOnMobile: false,
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
    get alwaysNewPaneForSymbols() {
        return this.data.alwaysNewPaneForSymbols;
    }
    set alwaysNewPaneForSymbols(value) {
        this.data.alwaysNewPaneForSymbols = value;
    }
    get useActivePaneForSymbolsOnMobile() {
        return this.data.useActivePaneForSymbolsOnMobile;
    }
    set useActivePaneForSymbolsOnMobile(value) {
        this.data.useActivePaneForSymbolsOnMobile = value;
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
        return this.data.enabledSymbolTypes[symbol];
    }
    setSymbolTypeEnabled(symbol, isEnabled) {
        this.data.enabledSymbolTypes[symbol] = isEnabled;
    }
}

// type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
//   ? 1
//   : 2
//   ? A
//   : B;
// // Type that represents only the writable keys of an object
// // https://stackoverflow.com/a/49579497
// export type WritableKeysOf<T> = {
//   [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>;
// }[keyof T];
// // type WritableSettingsConfigKeys = Pick<
// //   SwitcherPlusSettings,
// //   WritableKeysOf<SwitcherPlusSettings>
// // >;
// type ReadonlyKeys = 'builtInSystemOptions' | 'editorListPlaceholderText' | 'excludeViewTypes' | 'headingsListPlaceholderText' | 'includeSidePanelViewTypesPlaceholder' | 'referenceViews' | 'relatedItemsListPlaceholderText' | 'showAllFileTypes' | 'showAttachments' | 'showExistingOnly' | 'starredListPlaceholderText' | 'symbolListPlaceholderText' | 'workspaceListPlaceholderText';
// type WritableSettingsConfigKeys = keyof Omit<SwitcherPlusSettings, ReadonlyKeys>;
class SettingsTabSection {
    constructor(app, mainSettingsTab, settings) {
        this.app = app;
        this.mainSettingsTab = mainSettingsTab;
        this.settings = settings;
    }
    createSetting(containerEl, name, desc) {
        const setting = new obsidian.Setting(containerEl);
        setting.setName(name);
        setting.setDesc(desc);
        return setting;
    }
}

class StarredSettingTabSection extends SettingsTabSection {
    display(containerEl) {
        containerEl.createEl('h2', { text: 'Starred List Mode Settings' });
        this.setStarredListCommand(containerEl, this.settings);
    }
    setStarredListCommand(containerEl, settings) {
        this.createSetting(containerEl, 'Starred list mode trigger', 'Character that will trigger starred list mode in the switcher').addText((text) => text
            .setPlaceholder(settings.starredListPlaceholderText)
            .setValue(settings.starredListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.starredListPlaceholderText;
            settings.starredListCommand = val;
            settings.save();
        }));
    }
}

class CommandListSettingTabSection extends SettingsTabSection {
    display(containerEl) {
        containerEl.createEl('h2', { text: 'Command List Mode Settings' });
        this.setCommandListCommand(containerEl, this.settings);
    }
    setCommandListCommand(containerEl, settings) {
        this.createSetting(containerEl, 'Command list mode trigger', 'Character that will trigger command list mode in the switcher').addText((text) => text
            .setPlaceholder(settings.commandListPlaceholderText)
            .setValue(settings.commandListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.commandListPlaceholderText;
            settings.commandListCommand = val;
            settings.save();
        }));
    }
}

class RelatedItemsSettingTabSection extends SettingsTabSection {
    display(containerEl) {
        containerEl.createEl('h2', { text: 'Related Items List Mode Settings' });
        this.setRelatedItemsListCommand(containerEl, this.settings);
    }
    setRelatedItemsListCommand(containerEl, settings) {
        this.createSetting(containerEl, 'Related Items list mode trigger', 'Character that will trigger related items list mode in the switcher').addText((text) => text
            .setPlaceholder(settings.relatedItemsListPlaceholderText)
            .setValue(settings.relatedItemsListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.relatedItemsListPlaceholderText;
            settings.relatedItemsListCommand = val;
            settings.save();
        }));
    }
}

class SwitcherPlusSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl, settings } = this;
        containerEl.empty();
        this.setSymbolModeSettingsGroup(containerEl, settings);
        this.setEditorModeSettingsGroup(containerEl, settings);
        SwitcherPlusSettingTab.setWorkspaceModeSettingsGroup(containerEl, settings);
        this.setHeadingsModeSettingsGroup(containerEl, settings);
        const starredSection = new StarredSettingTabSection(this.app, this, settings);
        starredSection.display(containerEl);
        const commandListSection = new CommandListSettingTabSection(this.app, this, settings);
        commandListSection.display(containerEl);
        const relatedItemsSection = new RelatedItemsSettingTabSection(this.app, this, settings);
        relatedItemsSection.display(containerEl);
    }
    setEditorModeSettingsGroup(containerEl, settings) {
        containerEl.createEl('h2', { text: 'Editor List Mode Settings' });
        SwitcherPlusSettingTab.setEditorListCommand(containerEl, settings);
        this.setIncludeSidePanelViews(containerEl, settings);
    }
    setSymbolModeSettingsGroup(containerEl, settings) {
        containerEl.createEl('h2', { text: 'Symbol List Mode Settings' });
        SwitcherPlusSettingTab.setSymbolListCommand(containerEl, settings);
        SwitcherPlusSettingTab.setSymbolsInLineOrder(containerEl, settings);
        SwitcherPlusSettingTab.setAlwaysNewPaneForSymbols(containerEl, settings);
        SwitcherPlusSettingTab.setUseActivePaneForSymbolsOnMobile(containerEl, settings);
        SwitcherPlusSettingTab.setSelectNearestHeading(containerEl, settings);
        this.setEnabledSymbolTypes(containerEl, settings);
    }
    static setWorkspaceModeSettingsGroup(containerEl, settings) {
        containerEl.createEl('h2', { text: 'Workspace List Mode Settings' });
        SwitcherPlusSettingTab.setWorkspaceListCommand(containerEl, settings);
    }
    setHeadingsModeSettingsGroup(containerEl, settings) {
        containerEl.createEl('h2', { text: 'Headings List Mode Settings' });
        SwitcherPlusSettingTab.setHeadingsListCommand(containerEl, settings);
        SwitcherPlusSettingTab.setStrictHeadingsOnly(containerEl, settings);
        SwitcherPlusSettingTab.setSearchAllHeadings(containerEl, settings);
        this.setExcludeFolders(containerEl, settings);
    }
    static setAlwaysNewPaneForSymbols(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in new pane')
            .setDesc('Enabled, always open a new pane when navigating to Symbols. Disabled, navigate in an already open pane (if one exists)')
            .addToggle((toggle) => toggle.setValue(settings.alwaysNewPaneForSymbols).onChange((value) => {
            settings.alwaysNewPaneForSymbols = value;
            settings.save();
        }));
    }
    static setUseActivePaneForSymbolsOnMobile(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in active pane on mobile devices')
            .setDesc('Enabled, navigate to the target file and symbol in the active editor pane. Disabled, open a new pane when navigating to Symbols, even on mobile devices.')
            .addToggle((toggle) => toggle.setValue(settings.useActivePaneForSymbolsOnMobile).onChange((value) => {
            settings.useActivePaneForSymbolsOnMobile = value;
            settings.save();
        }));
    }
    static setSelectNearestHeading(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Auto-select nearest heading')
            .setDesc('Enabled, in an unfiltered symbol list, select the closest preceding Heading to the current cursor position. Disabled, the first symbol in the list is selected.')
            .addToggle((toggle) => toggle.setValue(settings.selectNearestHeading).onChange((value) => {
            settings.selectNearestHeading = value;
            settings.save();
        }));
    }
    static setSymbolsInLineOrder(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('List symbols as indented outline')
            .setDesc('Enabled, symbols will be displayed in the (line) order they appear in the source text, indented under any preceding heading. Disabled, symbols will be grouped by type: Headings, Tags, Links, Embeds.')
            .addToggle((toggle) => toggle.setValue(settings.symbolsInLineOrder).onChange((value) => {
            settings.symbolsInLineOrder = value;
            settings.save();
        }));
    }
    setEnabledSymbolTypes(containerEl, settings) {
        new obsidian.Setting(containerEl).setName('Show Headings').addToggle((toggle) => toggle
            .setValue(settings.isSymbolTypeEnabled(SymbolType.Heading))
            .onChange((value) => {
            settings.setSymbolTypeEnabled(SymbolType.Heading, value);
            settings.save();
        }));
        new obsidian.Setting(containerEl).setName('Show Tags').addToggle((toggle) => toggle.setValue(settings.isSymbolTypeEnabled(SymbolType.Tag)).onChange((value) => {
            settings.setSymbolTypeEnabled(SymbolType.Tag, value);
            settings.save();
        }));
        new obsidian.Setting(containerEl).setName('Show Embeds').addToggle((toggle) => toggle
            .setValue(settings.isSymbolTypeEnabled(SymbolType.Embed))
            .onChange((value) => {
            settings.setSymbolTypeEnabled(SymbolType.Embed, value);
            settings.save();
        }));
        this.setEnableLinks(containerEl, settings);
    }
    setEnableLinks(containerEl, settings) {
        const isLinksEnabled = settings.isSymbolTypeEnabled(SymbolType.Link);
        new obsidian.Setting(containerEl).setName('Show Links').addToggle((toggle) => {
            toggle.setValue(isLinksEnabled).onChange(async (value) => {
                settings.setSymbolTypeEnabled(SymbolType.Link, value);
                // have to await the save here because the call to display() will trigger a read
                // of the updated data
                await settings.saveSettings();
                // reload the settings panel. This will cause the sublink types toggle
                // controls to be shown/hidden based on isLinksEnabled status
                this.display();
            });
        });
        if (isLinksEnabled) {
            SwitcherPlusSettingTab.addSubLinkTypeToggle(containerEl, settings, LinkType.Heading, 'Links to headings');
            SwitcherPlusSettingTab.addSubLinkTypeToggle(containerEl, settings, LinkType.Block, 'Links to blocks');
        }
    }
    static addSubLinkTypeToggle(containerEl, settings, linkType, name) {
        new obsidian.Setting(containerEl)
            .setClass('qsp-setting-item-indent')
            .setName(name)
            .addToggle((toggle) => {
            const isExcluded = (settings.excludeLinkSubTypes & linkType) === linkType;
            toggle.setValue(!isExcluded).onChange((isEnabled) => {
                let exclusions = settings.excludeLinkSubTypes;
                if (isEnabled) {
                    // remove from exclusion list
                    exclusions &= ~linkType;
                }
                else {
                    // add to exclusion list
                    exclusions |= linkType;
                }
                settings.excludeLinkSubTypes = exclusions;
                settings.save();
            });
        });
    }
    static setEditorListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Editor list mode trigger')
            .setDesc('Character that will trigger editor list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.editorListPlaceholderText)
            .setValue(settings.editorListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.editorListPlaceholderText;
            settings.editorListCommand = val;
            settings.save();
        }));
    }
    static setSymbolListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Symbol list mode trigger')
            .setDesc('Character that will trigger symbol list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.symbolListPlaceholderText)
            .setValue(settings.symbolListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.symbolListPlaceholderText;
            settings.symbolListCommand = val;
            settings.save();
        }));
    }
    setIncludeSidePanelViews(containerEl, settings) {
        const viewsListing = Object.keys(this.app.viewRegistry.viewByType).sort().join(' ');
        new obsidian.Setting(containerEl)
            .setName('Include side panel views')
            .setDesc(`When in Editor list mode, show the following view types from the side panels. Add one view type per line. Available view types: ${viewsListing}`)
            .addTextArea((textArea) => textArea
            .setPlaceholder(settings.includeSidePanelViewTypesPlaceholder)
            .setValue(settings.includeSidePanelViewTypes.join('\n'))
            .onChange((value) => {
            settings.includeSidePanelViewTypes = value.split('\n');
            settings.save();
        }));
    }
    static setWorkspaceListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Workspace list mode trigger')
            .setDesc('Character that will trigger workspace list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.workspaceListPlaceholderText)
            .setValue(settings.workspaceListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.workspaceListPlaceholderText;
            settings.workspaceListCommand = val;
            settings.save();
        }));
    }
    static setHeadingsListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Headings list mode trigger')
            .setDesc('Character that will trigger headings list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.headingsListPlaceholderText)
            .setValue(settings.headingsListCommand)
            .onChange((value) => {
            const val = value.length ? value : settings.headingsListPlaceholderText;
            settings.headingsListCommand = val;
            settings.save();
        }));
    }
    static setStrictHeadingsOnly(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Show headings only')
            .setDesc('Enabled, only show suggestions where there is a match in the first H1 contained in the file. Disabled, if there is not a match in the first H1, fallback to showing suggestions where there is a filename match.')
            .addToggle((toggle) => toggle.setValue(settings.strictHeadingsOnly).onChange((value) => {
            settings.strictHeadingsOnly = value;
            settings.save();
        }));
    }
    static setSearchAllHeadings(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Search all headings')
            .setDesc('Enabled, search through all headings contained in each file. Disabled, only search through the first H1 in each file.')
            .addToggle((toggle) => toggle.setValue(settings.searchAllHeadings).onChange((value) => {
            settings.searchAllHeadings = value;
            settings.save();
        }));
    }
    setExcludeFolders(containerEl, settings) {
        const settingName = 'Exclude folders';
        new obsidian.Setting(containerEl)
            .setName(settingName)
            .setDesc(`When in Headings list mode, folder path that match any regex listed here will not be searched for suggestions. Path should start from the Vault Root. Add one path per line.`)
            .addTextArea((textArea) => {
            textArea.setValue(settings.excludeFolders.join('\n'));
            textArea.inputEl.addEventListener('blur', () => {
                const excludes = textArea
                    .getValue()
                    .split('\n')
                    .filter((v) => v.length > 0);
                if (this.validateExcludeFolderList(settingName, excludes)) {
                    settings.excludeFolders = excludes;
                    settings.save();
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

class Handler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
    get commandString() {
        return null;
    }
    validateCommand(_inputInfo, _index, _filterText, _activeSuggestion, _activeLeaf) {
        // no op
    }
    getSuggestions(_inputInfo) {
        return [];
    }
    renderSuggestion(_sugg, _parentEl) {
        // no op
    }
    onChooseSuggestion(_sugg, _evt) {
        // no op
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
            ({ leaf } = this.findOpenEditor(info.file, info.leaf));
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
     * @param  {WorkspaceLeaf} leaf Optional, a 'reference' WorkspaceLeaf (example: backlinks, outline, etc.. views) that is used as a pointer to a source file.
     * @returns TargetInfo
     */
    findOpenEditor(file, leaf) {
        const isTargetLeaf = !!leaf;
        const { settings: { referenceViews, excludeViewTypes, includeSidePanelViewTypes }, app: { workspace }, } = this;
        const isMatch = (l) => {
            let val = false;
            if (l) {
                const isRefView = referenceViews.includes(l.view.getViewType());
                const isTargetRefView = isTargetLeaf && referenceViews.includes(leaf.view.getViewType());
                if (!isRefView) {
                    val = isTargetLeaf && !isTargetRefView ? l === leaf : l.view?.file === file;
                }
            }
            return val;
        };
        // See if the active leaf matches first, otherwise find the first matching leaf,
        // if there is one
        let matchingLeaf = workspace.activeLeaf;
        if (!isMatch(matchingLeaf)) {
            const leaves = getOpenLeaves(workspace, excludeViewTypes, includeSidePanelViewTypes);
            matchingLeaf = leaves.find(isMatch);
        }
        return {
            leaf: matchingLeaf ?? null,
            file,
            suggestion: null,
            isValidSource: false,
        };
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
                    suggestions.push({ type: 'workspace', item, match });
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
            obsidian.renderResults(parentEl, sugg.item.id, sugg.match);
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
        const { workspace } = this.app;
        const isModDown = obsidian.Keymap.isModEvent(evt);
        if (sugg) {
            const { start: { line, col }, end: endLoc, } = sugg.item.position;
            // state information to highlight the target heading
            const eState = {
                startLoc: { line, col },
                endLoc,
                line,
                cursor: {
                    from: { line, ch: col },
                    to: { line, ch: col },
                },
            };
            openFileInLeaf(workspace, sugg.file, isModDown, {
                active: true,
                eState,
            }, 'Unable to navigate to heading for file.');
        }
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { item } = sugg;
            obsidian.renderResults(parentEl, item.heading, sugg.match);
            parentEl.createSpan({
                cls: ['suggestion-flair', 'qsp-headings-indicator'],
                text: HeadingIndicators[item.level],
                prepend: true,
            });
            parentEl.createDiv({
                cls: 'suggestion-note',
                text: stripMDExtensionFromPath(sugg.file),
            });
        }
    }
    getSuggestions(inputInfo) {
        let suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { prepQuery, hasSearchTerm } = inputInfo.searchQuery;
            if (hasSearchTerm) {
                const { limit } = this.settings;
                suggestions = this.getAllFilesSuggestions(prepQuery);
                obsidian.sortSearchResults(suggestions);
                if (suggestions.length > 0 && limit > 0) {
                    suggestions = suggestions.slice(0, limit);
                }
            }
            else {
                suggestions = this.getRecentFilesSuggestions();
            }
        }
        return suggestions;
    }
    getAllFilesSuggestions(prepQuery) {
        const suggestions = [];
        const { app: { vault }, settings: { strictHeadingsOnly, showExistingOnly, excludeFolders }, } = this;
        const isExcludedFolder = matcherFnForRegExList(excludeFolders);
        let nodes = [vault.getRoot()];
        while (nodes.length > 0) {
            const node = nodes.pop();
            if (isTFile(node)) {
                this.processFile(suggestions, node, prepQuery);
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
    processFile(suggestions, file, prepQuery) {
        const { settings } = this;
        if (this.shouldIncludeFile(file)) {
            const hasH1 = this.addHeadingSuggestions(suggestions, prepQuery, file, settings.searchAllHeadings);
            if (!settings.strictHeadingsOnly) {
                if (!hasH1) {
                    // if there isn't a heading and strict is disabled, do a fallback search
                    // against the file path
                    this.addFileSuggestions(suggestions, prepQuery, file);
                }
                if (settings.shouldShowAlias) {
                    this.addAliasSuggestions(suggestions, prepQuery, file);
                }
            }
        }
    }
    addAliasSuggestions(suggestions, prepQuery, file) {
        const { metadataCache } = this.app;
        const frontMatter = metadataCache.getFileCache(file)?.frontmatter;
        if (frontMatter) {
            const aliases = FrontMatterParser.getAliases(frontMatter);
            let i = aliases.length;
            // create suggestions where there is a match with an alias
            while (i--) {
                const alias = aliases[i];
                const { match } = this.matchStrings(prepQuery, alias, null);
                if (match) {
                    suggestions.push(this.makeAliasSuggestion(alias, file, match));
                }
            }
        }
    }
    addFileSuggestions(suggestions, prepQuery, file) {
        const path = stripMDExtensionFromPath(file);
        const filename = filenameFromPath(path);
        const { isPrimary, match } = this.matchStrings(prepQuery, filename, path);
        if (isPrimary) {
            this.adjustMatchIndicesForPath(match.matches, path.length - filename.length);
        }
        if (match) {
            suggestions.push(this.makeFileSuggestion(file, match));
        }
    }
    addHeadingSuggestions(suggestions, prepQuery, file, allHeadings) {
        const { metadataCache } = this.app;
        const headingList = metadataCache.getFileCache(file)?.headings;
        let h1 = null;
        if (headingList) {
            let i = headingList.length;
            while (i--) {
                const heading = headingList[i];
                if (heading.level === 1) {
                    const { line } = heading.position.start;
                    if (h1 === null) {
                        h1 = heading;
                    }
                    else if (line < h1.position.start.line) {
                        h1 = heading;
                    }
                }
                if (allHeadings) {
                    this.matchAndPushHeading(suggestions, prepQuery, file, heading);
                }
            }
            if (!allHeadings && h1) {
                this.matchAndPushHeading(suggestions, prepQuery, file, h1);
            }
        }
        return !!h1;
    }
    matchAndPushHeading(suggestions, prepQuery, file, heading) {
        const { match } = this.matchStrings(prepQuery, heading.heading, null);
        if (match) {
            suggestions.push(this.makeHeadingSuggestion(heading, file, match));
        }
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
            const { match } = this.matchStrings(prepQuery, unresolved, null);
            if (match) {
                suggestions.push(this.makeUnresolvedSuggestion(unresolved, match));
            }
        }
    }
    makeAliasSuggestion(alias, file, match) {
        return {
            alias,
            file,
            match,
            type: 'alias',
        };
    }
    makeUnresolvedSuggestion(linktext, match) {
        return {
            linktext,
            match,
            type: 'unresolved',
        };
    }
    makeFileSuggestion(file, match) {
        return {
            file,
            match,
            type: 'file',
        };
    }
    makeHeadingSuggestion(item, file, match) {
        return {
            item,
            file,
            match,
            type: 'heading',
        };
    }
    matchStrings(prepQuery, primaryString, secondaryString) {
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
    adjustMatchIndicesForPath(matches, pathLen) {
        matches?.forEach((match) => {
            match[0] += pathLen;
            match[1] += pathLen;
        });
    }
    getRecentFilesSuggestions() {
        const suggestions = [];
        const { workspace, vault, metadataCache } = this.app;
        const recentFilePaths = workspace.getLastOpenFiles();
        recentFilePaths.forEach((path) => {
            const file = vault.getAbstractFileByPath(path);
            if (this.shouldIncludeFile(file)) {
                const f = file;
                let h1 = null;
                const h1s = metadataCache
                    .getFileCache(f)
                    ?.headings?.filter((h) => h.level === 1)
                    .sort((a, b) => a.position.start.line - b.position.start.line);
                if (h1s?.length) {
                    h1 = h1s[0];
                }
                const sugg = h1
                    ? this.makeHeadingSuggestion(h1, f, null)
                    : this.makeFileSuggestion(f, null);
                suggestions.push(sugg);
            }
        });
        return suggestions;
    }
    shouldIncludeFile(file) {
        let retVal = false;
        const { settings: { builtInSystemOptions: { showAttachments, showAllFileTypes }, }, app: { viewRegistry }, } = this;
        if (isTFile(file)) {
            const { extension } = file;
            retVal = viewRegistry.isExtensionRegistered(extension)
                ? showAttachments || extension === 'md'
                : showAllFileTypes;
        }
        return retVal;
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
            const { excludeViewTypes, includeSidePanelViewTypes } = this.settings;
            const items = getOpenLeaves(this.app.workspace, excludeViewTypes, includeSidePanelViewTypes);
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, item.getDisplayText());
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    const file = item.view?.file;
                    suggestions.push({ type: 'editor', file, item, match });
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
            obsidian.renderResults(parentEl, sugg.item.getDisplayText(), sugg.match);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const isModDown = obsidian.Keymap.isModEvent(evt);
            const { workspace } = this.app;
            if (isModDown) {
                openFileInLeaf(workspace, sugg.file, true, { active: true }, 'Unable to reopen existing editor in new Leaf.');
            }
            else {
                activateLeaf(workspace, sugg.item, false);
            }
        }
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
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            this.inputInfo = inputInfo;
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const symbolCmd = inputInfo.parsedCommand(Mode.SymbolList);
            const items = this.getItems(symbolCmd.source, hasSearchTerm);
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, SymbolHandler.getSuggestionTextForSymbol(item));
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    const { file } = symbolCmd.source;
                    suggestions.push({ type: 'symbol', file, item, match });
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
            let containerEl = parentEl;
            if (this.settings.symbolsInLineOrder &&
                this.inputInfo &&
                !this.inputInfo.searchQuery.hasSearchTerm) {
                containerEl.addClass(`qsp-symbol-l${item.indentLevel}`);
            }
            const text = SymbolHandler.getSuggestionTextForSymbol(item);
            SymbolHandler.addSymbolIndicator(item, containerEl);
            containerEl = parentEl.createSpan({
                cls: 'qsp-symbol-text',
            });
            obsidian.renderResults(containerEl, text, sugg.match);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const isModDown = obsidian.Keymap.isModEvent(evt);
            const symbolCmd = this.inputInfo.parsedCommand();
            const { app: { workspace }, settings, } = this;
            SymbolHandler.navigateToSymbol(sugg, symbolCmd, isModDown, settings, workspace);
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
    getItems(sourceInfo, hasSearchTerm) {
        let items = [];
        let symbolsInLineOrder = false;
        let selectNearestHeading = false;
        if (!hasSearchTerm) {
            ({ selectNearestHeading, symbolsInLineOrder } = this.settings);
        }
        items = this.getSymbolsFromSource(sourceInfo, symbolsInLineOrder);
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
    getSymbolsFromSource(sourceInfo, orderByLineNumber) {
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
            }
        }
        return orderByLineNumber ? SymbolHandler.orderSymbolsByLineNumber(ret) : ret;
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
    static orderSymbolsByLineNumber(symbols = []) {
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
    static addSymbolIndicator(symbolInfo, parentEl) {
        const { symbolType, symbol } = symbolInfo;
        let indicator;
        if (isHeadingCache(symbol)) {
            indicator = HeadingIndicators[symbol.level];
        }
        else {
            indicator = SymbolIndicators[symbolType];
        }
        parentEl.createDiv({
            text: indicator,
            cls: 'qsp-symbol-indicator',
        });
    }
    static navigateToSymbol(sugg, symbolCmd, shouldCreateNewLeaf, settings, workspace) {
        const { alwaysNewPaneForSymbols, useActivePaneForSymbolsOnMobile } = settings;
        const { leaf, file } = symbolCmd.source;
        const { start: { line, col }, end: endLoc, } = sugg.item.symbol.position;
        // object containing the state information for the target editor,
        // start with the range to highlight in target editor
        const eState = {
            startLoc: { line, col },
            endLoc,
            line,
            cursor: {
                from: { line, ch: col },
                to: { line, ch: col },
            },
        };
        const { isMobile } = obsidian.Platform;
        let createNewLeaf = shouldCreateNewLeaf || alwaysNewPaneForSymbols;
        if (isMobile) {
            createNewLeaf = shouldCreateNewLeaf || !useActivePaneForSymbolsOnMobile;
        }
        if (leaf && !createNewLeaf) {
            activateLeaf(workspace, leaf, true, eState);
        }
        else {
            openFileInLeaf(workspace, file, createNewLeaf, { eState }, `Unable to navigate to symbol for file ${file.path}`);
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
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, item.title);
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({ type: 'starred', file, item, match });
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
            obsidian.renderResults(parentEl, sugg.item.title, sugg.match);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const { item } = sugg;
            if (isFileStarredItem(item)) {
                const { workspace } = this.app;
                const isModDown = obsidian.Keymap.isModEvent(evt);
                const state = { active: true };
                workspace.openLinkText(item.path, '', isModDown, state).catch((reason) => 
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                console.log(`Switcher++: unable to open file ${item.path}. ${reason}`));
            }
        }
    }
    getTFileByPath(path) {
        let file = null;
        const abstractItem = this.app.vault.getAbstractFileByPath(path);
        if (isTFile(abstractItem)) {
            file = abstractItem;
        }
        return file;
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
}

const COMMAND_PALETTE_PLUGIN_ID = 'command-palette';
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
            const itemsInfo = this.getItems();
            itemsInfo.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, item.name);
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({
                        type: 'command',
                        item,
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
            obsidian.renderResults(parentEl, sugg.item.name, sugg.match);
        }
    }
    onChooseSuggestion(sugg) {
        if (sugg) {
            const { item } = sugg;
            this.app.commands.executeCommandById(item.id);
        }
    }
    getItems() {
        // Sort commands by their name
        const items = this.app.commands.listCommands().sort((a, b) => {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        // Pinned commands should be at the top (if any)
        if (this.isCommandPalettePluginEnabled() &&
            this.getCommandPalettePluginInstance()?.options.pinned?.length > 0) {
            const pinnedCommandIds = this.getCommandPalettePluginInstance().options.pinned;
            // We're gonna find the pinned command in `items` and move it to the beginning
            // Therefore we need to perform "for each right"
            for (let i = pinnedCommandIds.length - 1; i >= 0; i--) {
                const commandId = pinnedCommandIds[i];
                const commandIndex = items.findIndex((c) => c.id === commandId);
                if (commandIndex > -1) {
                    const command = items[commandIndex];
                    items.splice(commandIndex, 1);
                    items.unshift(command);
                }
            }
        }
        return items;
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
            const items = this.getRelatedFiles(cmd.source.file);
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, this.getTitleText(item));
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({
                        type: 'relatedItems',
                        relationType: 'diskLocation',
                        file: item,
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
            obsidian.renderResults(parentEl, this.getTitleText(sugg.file), sugg.match);
        }
    }
    onChooseSuggestion(sugg, evt) {
        if (sugg) {
            const isModDown = obsidian.Keymap.isModEvent(evt);
            const { file } = sugg;
            const { leaf } = this.findOpenEditor(file);
            const { workspace } = this.app;
            const eState = { active: true, focus: true };
            if (leaf && !isModDown) {
                activateLeaf(workspace, leaf, true, eState);
            }
            else {
                openFileInLeaf(workspace, file, isModDown, { eState }, `Unable to open related file ${file.path}`);
            }
        }
    }
    getTitleText(sourceFile) {
        return stripMDExtensionFromPath(sourceFile);
    }
    getRelatedFiles(sourceFile) {
        const relatedFiles = [];
        const { excludeRelatedFolders, excludeOpenRelatedFiles } = this.settings;
        const isExcludedFolder = matcherFnForRegExList(excludeRelatedFolders);
        let nodes = [...sourceFile.parent.children];
        while (nodes.length > 0) {
            const node = nodes.pop();
            if (isTFile(node)) {
                const isSourceFile = node === sourceFile;
                const isExcluded = isSourceFile || (excludeOpenRelatedFiles && !!this.findOpenEditor(node).leaf);
                if (!isExcluded) {
                    relatedFiles.push(node);
                }
            }
            else if (!isExcludedFolder(node.path)) {
                nodes = nodes.concat(node.children);
            }
        }
        return relatedFiles;
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
}

class InputInfo {
    constructor(inputText = '', mode = Mode.Standard) {
        this.inputText = inputText;
        this.mode = mode;
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
        const handlersByMode = new Map();
        this.handlersByMode = handlersByMode;
        handlersByMode.set(Mode.SymbolList, new SymbolHandler(app, settings));
        handlersByMode.set(Mode.WorkspaceList, new WorkspaceHandler(app, settings));
        handlersByMode.set(Mode.HeadingsList, new HeadingsHandler(app, settings));
        handlersByMode.set(Mode.EditorList, new EditorHandler(app, settings));
        handlersByMode.set(Mode.StarredList, new StarredHandler(app, settings));
        handlersByMode.set(Mode.CommandList, new CommandHandler(app, settings));
        handlersByMode.set(Mode.RelatedItemsList, new RelatedItemsHandler(app, settings));
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
    updateSuggestions(query, chooser) {
        let handled = false;
        const { exKeymap, app: { workspace: { activeLeaf }, }, } = this;
        const activeSugg = ModeHandler.getActiveSuggestion(chooser);
        const inputInfo = this.determineRunMode(query, activeSugg, activeLeaf);
        const { mode } = inputInfo;
        exKeymap.updateKeymapForMode(mode);
        if (mode !== Mode.Standard) {
            if (mode === Mode.HeadingsList && inputInfo.parsedCommand().parsedInput?.length) {
                // if headings mode and user is typing a query, delay getting suggestions
                this.debouncedGetSuggestions(inputInfo, chooser);
            }
            else {
                this.getSuggestions(inputInfo, chooser);
            }
            handled = true;
        }
        return handled;
    }
    renderSuggestion(sugg, parentEl) {
        let handled = false;
        if (isExSuggestion(sugg)) {
            this.getHandler(sugg).renderSuggestion(sugg, parentEl);
            handled = true;
        }
        return handled;
    }
    onChooseSuggestion(sugg, evt) {
        let handled = false;
        if (isExSuggestion(sugg)) {
            this.getHandler(sugg).onChooseSuggestion(sugg, evt);
            handled = true;
        }
        return handled;
    }
    determineRunMode(query, activeSugg, activeLeaf) {
        const input = query ?? '';
        const info = new InputInfo(input);
        if (input.length === 0) {
            this.reset();
        }
        this.validatePrefixCommands(info, activeSugg, activeLeaf);
        this.validateSourcedCommands(info, activeSugg, activeLeaf);
        return info;
    }
    getSuggestions(inputInfo, chooser) {
        this.inputInfo = inputInfo;
        const { mode } = inputInfo;
        chooser.setSuggestions([]);
        const suggestions = this.getHandler(mode).getSuggestions(inputInfo);
        chooser.setSuggestions(suggestions);
        ModeHandler.setActiveSuggestion(mode, chooser);
    }
    validatePrefixCommands(inputInfo, activeSugg, activeLeaf) {
        const { inputText } = inputInfo;
        const { editorListCommand, workspaceListCommand, headingsListCommand, starredListCommand, commandListCommand, } = this.settings;
        const escEditorCmd = escapeRegExp(editorListCommand);
        const escWorkspaceCmd = escapeRegExp(workspaceListCommand);
        const escHeadingsCmd = escapeRegExp(headingsListCommand);
        const escStarredCmd = escapeRegExp(starredListCommand);
        const escCommandListCmd = escapeRegExp(commandListCommand);
        // account for potential overlapping command strings
        const prefixCmds = [
            `(?<ep>${escEditorCmd})`,
            `(?<wp>${escWorkspaceCmd})`,
            `(?<hp>${escHeadingsCmd})`,
            `(?<sp>${escStarredCmd})`,
            `(?<cp>${escCommandListCmd})`,
        ].sort((a, b) => b.length - a.length);
        // regex that matches editor, workspace, headings prefixes, and extract filter text
        // ^(?:(?<ep>edt )|(?<wp>+)|(?<hp>#)|(?<sp>*))(?<ft>.*)$
        const match = new RegExp(`^(?:${prefixCmds[0]}|${prefixCmds[1]}|${prefixCmds[2]}|${prefixCmds[3]}|${prefixCmds[4]})(?<ft>.*)$`).exec(inputText);
        if (match?.groups) {
            let mode = null;
            const { index, groups: { ep, wp, hp, sp, cp, ft }, } = match;
            if (ep) {
                mode = Mode.EditorList;
            }
            else if (wp) {
                mode = Mode.WorkspaceList;
            }
            else if (hp) {
                mode = Mode.HeadingsList;
            }
            else if (sp) {
                mode = Mode.StarredList;
            }
            else if (cp) {
                mode = Mode.CommandList;
            }
            if (mode) {
                this.getHandler(mode).validateCommand(inputInfo, index, ft, activeSugg, activeLeaf);
            }
        }
    }
    validateSourcedCommands(inputInfo, activeSugg, activeLeaf) {
        const { mode, inputText } = inputInfo;
        const { symbolListCommand, relatedItemsListCommand } = this.settings;
        // Standard, Headings, Starred, and EditorList mode can have an embedded command
        const supportedModes = [
            Mode.Standard,
            Mode.EditorList,
            Mode.HeadingsList,
            Mode.StarredList,
        ];
        if (supportedModes.includes(mode)) {
            const escSymbolCmd = escapeRegExp(symbolListCommand);
            const escRelatedCmd = escapeRegExp(relatedItemsListCommand);
            const embeddedCmds = [`(?<se>${escSymbolCmd})`, `(?<re>${escRelatedCmd})`].sort((a, b) => b.length - a.length);
            // regex that matches symbol command, and extract filter text
            // (?:(?<se>@)|(?<re>~))(?<ft>.*)$
            const match = new RegExp(`(?:${embeddedCmds[0]}|${embeddedCmds[1]})(?<ft>.*)$`).exec(inputText);
            if (match?.groups) {
                const { index, groups } = match;
                const cmdToModeMap = new Map([
                    [symbolListCommand, Mode.SymbolList],
                    [relatedItemsListCommand, Mode.RelatedItemsList],
                ]);
                // find the group that is not filter text (ft),
                // and the value of the group is truthy
                const groupKey = Object.keys(groups).find((v) => v !== 'ft' && groups[v]);
                const targetMode = cmdToModeMap.get(groups[groupKey]);
                if (targetMode) {
                    this.getHandler(targetMode).validateCommand(inputInfo, index, groups.ft, activeSugg, activeLeaf);
                }
            }
        }
    }
    static setActiveSuggestion(mode, chooser) {
        // only symbol mode currently sets an active selection
        if (mode === Mode.SymbolList) {
            const index = chooser.values
                .filter((v) => isSymbolSuggestion(v))
                .findIndex((v) => v.item.isSelected);
            if (index !== -1) {
                chooser.setSelectedItem(index, true);
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
        this.getHandler(Mode.SymbolList).reset();
        this.getHandler(Mode.RelatedItemsList).reset();
    }
    getHandler(kind) {
        let mode;
        if (typeof kind === 'number') {
            mode = kind;
        }
        else {
            if (isEditorSuggestion(kind)) {
                mode = Mode.EditorList;
            }
            else if (isWorkspaceSuggestion(kind)) {
                mode = Mode.WorkspaceList;
            }
            else if (isHeadingSuggestion(kind)) {
                mode = Mode.HeadingsList;
            }
            else if (isSymbolSuggestion(kind)) {
                mode = Mode.SymbolList;
            }
            else if (isStarredSuggestion(kind)) {
                mode = Mode.StarredList;
            }
            else if (isCommandSuggestion(kind)) {
                mode = Mode.CommandList;
            }
            else if (isRelatedItemsSuggestion(kind)) {
                mode = Mode.RelatedItemsList;
            }
        }
        return this.handlersByMode.get(mode);
    }
}

class Keymap {
    constructor(scope, chooser, modalContainerEl) {
        this.scope = scope;
        this.chooser = chooser;
        this.modalContainerEl = modalContainerEl;
        this.registerBindings(scope);
    }
    get isOpen() {
        return this._isOpen;
    }
    set isOpen(value) {
        this._isOpen = value;
    }
    registerBindings(scope) {
        scope.register(['Ctrl'], 'n', this.navigateItems.bind(this));
        scope.register(['Ctrl'], 'p', this.navigateItems.bind(this));
    }
    navigateItems(_evt, ctx) {
        const { isOpen, chooser } = this;
        if (isOpen) {
            let index = chooser.selectedItem;
            index = ctx.key === 'n' ? ++index : --index;
            chooser.setSelectedItem(index, true);
        }
        return false;
    }
    static updateHelperTextForMode(mode, containerEl) {
        const selector = '.prompt-instructions';
        const el = containerEl.querySelector(selector);
        if (el) {
            el.style.display = mode === Mode.Standard ? '' : 'none';
        }
    }
    updateKeymapForMode(mode) {
        const keys = this.scope.keys;
        let { backupKeys = [] } = this;
        Keymap.updateHelperTextForMode(mode, this.modalContainerEl);
        if (mode === Mode.Standard) {
            if (backupKeys.length) {
                backupKeys.forEach((key) => keys.push(key));
            }
            backupKeys = undefined;
        }
        else {
            // unregister unused hotkeys for custom modes
            for (let i = keys.length - 1; i >= 0; --i) {
                const key = keys[i];
                // modifiers are serialized to string at run time, if they exist
                const modifiers = key.modifiers?.toString();
                if (key.key === 'Enter' && modifiers === 'Shift') {
                    keys.splice(i, 1);
                    backupKeys.push(key);
                }
            }
        }
        this.backupKeys = backupKeys;
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
            const exKeymap = new Keymap(this.scope, this.chooser, this.containerEl);
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
            if (!exMode.updateSuggestions(inputEl.value, chooser)) {
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
        this.registerCommand('switcher-plus:open-editors', 'Open in Editor Mode', Mode.EditorList);
        this.registerCommand('switcher-plus:open-symbols', 'Open in Symbol Mode', Mode.SymbolList);
        this.registerCommand('switcher-plus:open-workspaces', 'Open in Workspaces Mode', Mode.WorkspaceList);
        this.registerCommand('switcher-plus:open-headings', 'Open in Headings Mode', Mode.HeadingsList);
        this.registerCommand('switcher-plus:open-starred', 'Open in Starred Mode', Mode.StarredList);
        this.registerCommand('switcher-plus:open-commands', 'Open in Commands Mode', Mode.CommandList);
        this.registerCommand('switcher-plus:open-related-items', 'Open in Related Items Mode', Mode.RelatedItemsList);
    }
    registerCommand(id, name, mode) {
        this.addCommand({
            id,
            name,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R5cGVzL3NoYXJlZFR5cGVzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL3V0aWxzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2Zyb250TWF0dGVyUGFyc2VyLnRzIiwiLi4vLi4vc3JjL3V0aWxzL3BhbmVsVXRpbHMudHMiLCIuLi8uLi9zcmMvc2V0dGluZ3Mvc3dpdGNoZXJQbHVzU2V0dGluZ3MudHMiLCIuLi8uLi9zcmMvc2V0dGluZ3Mvc2V0dGluZ3NUYWJTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N0YXJyZWRTZXR0aW5nc1RhYlNlY3Rpb24udHMiLCIuLi8uLi9zcmMvc2V0dGluZ3MvY29tbWFuZExpc3RTZXR0aW5nc1RhYlNlY3Rpb24udHMiLCIuLi8uLi9zcmMvc2V0dGluZ3MvcmVsYXRlZEl0ZW1zU2V0dGluZ3NUYWJTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdUYWIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvaGFuZGxlci50cyIsIi4uLy4uL3NyYy9IYW5kbGVycy93b3Jrc3BhY2VIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL0hhbmRsZXJzL2hlYWRpbmdzSGFuZGxlci50cyIsIi4uLy4uL3NyYy9IYW5kbGVycy9lZGl0b3JIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL0hhbmRsZXJzL3N5bWJvbEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvc3RhcnJlZEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvY29tbWFuZEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvcmVsYXRlZEl0ZW1zSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvaW5wdXRJbmZvLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9tb2RlSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMva2V5bWFwLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9zd2l0Y2hlclBsdXMudHMiLCIuLi8uLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiLCJNb2RhbCIsImZ1enp5U2VhcmNoIiwic29ydFNlYXJjaFJlc3VsdHMiLCJyZW5kZXJSZXN1bHRzIiwiS2V5bWFwIiwiUGxhdGZvcm0iLCJwcmVwYXJlUXVlcnkiLCJkZWJvdW5jZSIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQWdCQSxJQUFZLElBU1gsQ0FBQTtBQVRELENBQUEsVUFBWSxJQUFJLEVBQUE7QUFDZCxJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsVUFBWSxDQUFBO0FBQ1osSUFBQSxJQUFBLENBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFlBQWMsQ0FBQTtBQUNkLElBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxZQUFjLENBQUE7QUFDZCxJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsZUFBaUIsQ0FBQTtBQUNqQixJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsY0FBaUIsQ0FBQTtBQUNqQixJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsYUFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsYUFBZ0IsQ0FBQTtBQUNoQixJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsYUFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsYUFBZ0IsQ0FBQTtBQUNoQixJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsa0JBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLGtCQUFzQixDQUFBO0FBQ3hCLENBQUMsRUFUVyxJQUFJLEtBQUosSUFBSSxHQVNmLEVBQUEs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
