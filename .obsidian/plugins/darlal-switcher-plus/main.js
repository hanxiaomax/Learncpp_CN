'use strict';

var obsidian = require('obsidian');

var Mode;
(function (Mode) {
    Mode[Mode["Standard"] = 1] = "Standard";
    Mode[Mode["EditorList"] = 2] = "EditorList";
    Mode[Mode["SymbolList"] = 4] = "SymbolList";
    Mode[Mode["WorkspaceList"] = 8] = "WorkspaceList";
    Mode[Mode["HeadingsList"] = 16] = "HeadingsList";
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
    isSymbolTypeEnabled(symbol) {
        return this.data.enabledSymbolTypes[symbol];
    }
    setSymbolTypeEnabled(symbol, isEnabled) {
        this.data.enabledSymbolTypes[symbol] = isEnabled;
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
    static saveChanges(settings) {
        settings.saveSettings().catch((e) => {
            console.log('Switcher++: error saving changes to settings', e);
        });
    }
    static setAlwaysNewPaneForSymbols(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in new pane')
            .setDesc('Enabled, always open a new pane when navigating to Symbols. Disabled, navigate in an already open pane (if one exists)')
            .addToggle((toggle) => toggle.setValue(settings.alwaysNewPaneForSymbols).onChange((value) => {
            settings.alwaysNewPaneForSymbols = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setUseActivePaneForSymbolsOnMobile(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in active pane on mobile devices')
            .setDesc('Enabled, navigate to the target file and symbol in the active editor pane. Disabled, open a new pane when navigating to Symbols, even on mobile devices.')
            .addToggle((toggle) => toggle.setValue(settings.useActivePaneForSymbolsOnMobile).onChange((value) => {
            settings.useActivePaneForSymbolsOnMobile = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setSelectNearestHeading(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Auto-select nearest heading')
            .setDesc('Enabled, in an unfiltered symbol list, select the closest preceding Heading to the current cursor position. Disabled, the first symbol in the list is selected.')
            .addToggle((toggle) => toggle.setValue(settings.selectNearestHeading).onChange((value) => {
            settings.selectNearestHeading = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setSymbolsInLineOrder(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('List symbols as indented outline')
            .setDesc('Enabled, symbols will be displayed in the (line) order they appear in the source text, indented under any preceding heading. Disabled, symbols will be grouped by type: Headings, Tags, Links, Embeds.')
            .addToggle((toggle) => toggle.setValue(settings.symbolsInLineOrder).onChange((value) => {
            settings.symbolsInLineOrder = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    setEnabledSymbolTypes(containerEl, settings) {
        new obsidian.Setting(containerEl).setName('Show Headings').addToggle((toggle) => toggle
            .setValue(settings.isSymbolTypeEnabled(SymbolType.Heading))
            .onChange((value) => {
            settings.setSymbolTypeEnabled(SymbolType.Heading, value);
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
        new obsidian.Setting(containerEl).setName('Show Tags').addToggle((toggle) => toggle.setValue(settings.isSymbolTypeEnabled(SymbolType.Tag)).onChange((value) => {
            settings.setSymbolTypeEnabled(SymbolType.Tag, value);
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
        new obsidian.Setting(containerEl).setName('Show Embeds').addToggle((toggle) => toggle
            .setValue(settings.isSymbolTypeEnabled(SymbolType.Embed))
            .onChange((value) => {
            settings.setSymbolTypeEnabled(SymbolType.Embed, value);
            SwitcherPlusSettingTab.saveChanges(settings);
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
                SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setStrictHeadingsOnly(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Show headings only')
            .setDesc('Enabled, only show suggestions where there is a match in the first H1 contained in the file. Disabled, if there is not a match in the first H1, fallback to showing suggestions where there is a filename match.')
            .addToggle((toggle) => toggle.setValue(settings.strictHeadingsOnly).onChange((value) => {
            settings.strictHeadingsOnly = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setSearchAllHeadings(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Search all headings')
            .setDesc('Enabled, search through all headings contained in each file. Disabled, only search through the first H1 in each file.')
            .addToggle((toggle) => toggle.setValue(settings.searchAllHeadings).onChange((value) => {
            settings.searchAllHeadings = value;
            SwitcherPlusSettingTab.saveChanges(settings);
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
                    SwitcherPlusSettingTab.saveChanges(settings);
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

const WORKSPACE_PLUGIN_ID = 'workspaces';
class WorkspaceHandler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
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

class HeadingsHandler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
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
    onChooseSuggestion(sugg, _evt) {
        const { workspace } = this.app;
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
            workspace
                .getLeaf(false)
                .openFile(sugg.file, {
                active: true,
                eState,
            })
                .catch(() => console.log('Switcher++: unable to open file.'));
        }
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            const { item } = sugg;
            obsidian.renderResults(parentEl, item.heading, sugg.match);
            parentEl.createSpan({
                cls: 'suggestion-flair',
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

class EditorHandler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
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
                    suggestions.push({ type: 'editor', item, match });
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
    onChooseSuggestion(sugg, _evt) {
        if (sugg) {
            activateLeaf(this.app.workspace, sugg.item, false);
        }
    }
}

class SymbolHandler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
    get commandString() {
        return this.settings?.symbolListCommand;
    }
    validateCommand(inputInfo, index, filterText, activeSuggestion, activeLeaf) {
        const target = this.getSymbolTarget(activeSuggestion, activeLeaf, index === 0);
        if (target) {
            inputInfo.mode = Mode.SymbolList;
            const symbolCmd = inputInfo.parsedCommand(Mode.SymbolList);
            symbolCmd.target = target;
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
            const items = this.getItems(symbolCmd.target, hasSearchTerm);
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, SymbolHandler.getSuggestionTextForSymbol(item));
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({ type: 'symbol', item, match });
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
    onChooseSuggestion(sugg, _evt) {
        if (sugg) {
            this.navigateToSymbol(sugg);
        }
    }
    reset() {
        this.inputInfo = null;
    }
    getSymbolTarget(activeSuggestion, activeLeaf, isSymbolCmdPrefix) {
        const prevInputInfo = this.inputInfo;
        let prevTarget = null;
        let prevMode = Mode.Standard;
        if (prevInputInfo) {
            prevTarget = prevInputInfo.parsedCommand().target;
            prevMode = prevInputInfo.mode;
        }
        // figure out if the previous operation was a symbol operation
        const hasPrevSymbolTarget = prevMode === Mode.SymbolList && !!prevTarget;
        const activeSuggInfo = SymbolHandler.getActiveSuggestionInfo(activeSuggestion);
        const activeEditorInfo = this.getActiveEditorInfo(activeLeaf);
        // Pick the target for a potential symbol operation, prioritizing
        // any pre-existing symbol operation that was in progress
        let target = null;
        if (hasPrevSymbolTarget) {
            target = prevTarget;
        }
        else if (activeSuggInfo.isValidSymbolTarget) {
            target = activeSuggInfo;
        }
        else if (activeEditorInfo.isValidSymbolTarget && isSymbolCmdPrefix) {
            target = activeEditorInfo;
        }
        return target;
    }
    getActiveEditorInfo(activeLeaf) {
        const { excludeViewTypes } = this.settings;
        let file = null;
        let isValidSymbolTarget = false;
        let cursor = null;
        if (activeLeaf) {
            const { view } = activeLeaf;
            let isCurrentEditorValid = false;
            const viewType = view.getViewType();
            file = view.file;
            // determine if the current active editor pane is valid
            isCurrentEditorValid = !excludeViewTypes.includes(viewType);
            if (viewType === 'markdown') {
                const md = view;
                if (md.getMode() !== 'preview') {
                    const { editor } = md;
                    cursor = editor.getCursor('head');
                }
            }
            // whether or not the current active editor can be used as the target for
            // symbol search
            isValidSymbolTarget = isCurrentEditorValid && !!file;
        }
        return { isValidSymbolTarget, leaf: activeLeaf, file, suggestion: null, cursor };
    }
    static getActiveSuggestionInfo(activeSuggestion) {
        let file = null, leaf = null, isValidSymbolTarget = false;
        if (activeSuggestion &&
            !isSymbolSuggestion(activeSuggestion) &&
            !isUnresolvedSuggestion(activeSuggestion) &&
            !isWorkspaceSuggestion(activeSuggestion)) {
            // Can't use a symbol, workspace, unresolved (non-existent file) suggestions as
            // the target for another symbol command
            isValidSymbolTarget = true;
            if (isEditorSuggestion(activeSuggestion)) {
                leaf = activeSuggestion.item;
                file = leaf.view?.file;
            }
            else {
                // this catches system File suggestion, Heading, and Alias suggestion
                file = activeSuggestion.file;
            }
        }
        return { isValidSymbolTarget, leaf, file, suggestion: activeSuggestion };
    }
    getItems(target, hasSearchTerm) {
        let items = [];
        let symbolsInLineOrder = false;
        let selectNearestHeading = false;
        if (!hasSearchTerm) {
            ({ selectNearestHeading, symbolsInLineOrder } = this.settings);
        }
        items = this.getSymbolsForTarget(target, symbolsInLineOrder);
        if (selectNearestHeading) {
            SymbolHandler.FindNearestHeadingSymbol(items, target);
        }
        return items;
    }
    static FindNearestHeadingSymbol(items, targetInfo) {
        const cursorLine = targetInfo?.cursor?.line;
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
    getSymbolsForTarget(targetInfo, orderByLineNumber) {
        const { app: { metadataCache }, settings, } = this;
        const ret = [];
        if (targetInfo.file) {
            const file = targetInfo.file;
            const symbolData = metadataCache.getFileCache(file);
            if (symbolData) {
                const push = (symbols = [], symbolType) => {
                    if (settings.isSymbolTypeEnabled(symbolType)) {
                        symbols.forEach((symbol) => ret.push({ type: 'symbolInfo', symbol, symbolType }));
                    }
                };
                push(symbolData.headings, SymbolType.Heading);
                push(symbolData.tags, SymbolType.Tag);
                this.addLinksFromTarget(symbolData.links, ret);
                push(symbolData.embeds, SymbolType.Embed);
            }
        }
        return orderByLineNumber ? SymbolHandler.orderSymbolsByLineNumber(ret) : ret;
    }
    addLinksFromTarget(linkData, symbolList) {
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
    navigateToSymbol(sugg) {
        const { app: { workspace }, settings: { alwaysNewPaneForSymbols, useActivePaneForSymbolsOnMobile }, } = this;
        // determine if the target is already open in a pane
        const { leaf, file: { path }, } = this.findOpenEditorMatchingSymbolTarget();
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
        if (leaf && !alwaysNewPaneForSymbols) {
            activateLeaf(workspace, leaf, true, eState);
        }
        else {
            const { isDesktop, isMobile } = obsidian.Platform;
            const createNewLeaf = isDesktop || (isMobile && !useActivePaneForSymbolsOnMobile);
            workspace
                .openLinkText(path, '', createNewLeaf, { eState })
                .catch(() => console.log(`Switcher++: unable to navigate to symbol for file ${path}`));
        }
    }
    findOpenEditorMatchingSymbolTarget() {
        const { inputInfo, settings: { referenceViews, excludeViewTypes, includeSidePanelViewTypes }, app: { workspace }, } = this;
        const symbolCmd = inputInfo.parsedCommand();
        const { file, leaf } = symbolCmd.target;
        const isTargetLeaf = !!leaf;
        const predicate = (l) => {
            let val = false;
            const isRefView = referenceViews.includes(l.view.getViewType());
            const isTargetRefView = isTargetLeaf && referenceViews.includes(leaf.view.getViewType());
            if (!isRefView) {
                val = isTargetLeaf && !isTargetRefView ? l === leaf : l.view?.file === file;
            }
            return val;
        };
        const l = getOpenLeaves(workspace, excludeViewTypes, includeSidePanelViewTypes).find(predicate);
        return { leaf: l, file, suggestion: null, isValidSymbolTarget: false };
    }
}

class InputInfo {
    constructor(inputText = '', mode = Mode.Standard) {
        this.inputText = inputText;
        this.mode = mode;
        const sc = {
            ...InputInfo.defaultParsedCommand,
            target: null,
        };
        const pcs = {};
        pcs[Mode.SymbolList] = sc;
        pcs[Mode.Standard] = InputInfo.defaultParsedCommand;
        pcs[Mode.EditorList] = InputInfo.defaultParsedCommand;
        pcs[Mode.WorkspaceList] = InputInfo.defaultParsedCommand;
        pcs[Mode.HeadingsList] = InputInfo.defaultParsedCommand;
        this.parsedCommands = pcs;
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
        this.validateSymbolCommand(info, activeSugg, activeLeaf);
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
        const { editorListCommand, workspaceListCommand, headingsListCommand } = this.settings;
        const escEditorCmd = escapeRegExp(editorListCommand);
        const escWorkspaceCmd = escapeRegExp(workspaceListCommand);
        const escHeadingsCmd = escapeRegExp(headingsListCommand);
        // account for potential overlapping command strings
        const prefixCmds = [
            `(?<ep>${escEditorCmd})`,
            `(?<wp>${escWorkspaceCmd})`,
            `(?<hp>${escHeadingsCmd})`,
        ].sort((a, b) => b.length - a.length);
        // regex that matches editor, workspace, headings prefixes, and extract filter text
        // ^(?:(?<ep>edt )|(?<wp>+)|(?<hp>#))(?<ft>.*)$
        const match = new RegExp(`^(?:${prefixCmds[0]}|${prefixCmds[1]}|${prefixCmds[2]})(?<ft>.*)$`).exec(inputText);
        if (match?.groups) {
            let mode = null;
            const { index, groups: { ep, wp, hp, ft }, } = match;
            if (ep) {
                mode = Mode.EditorList;
            }
            else if (wp) {
                mode = Mode.WorkspaceList;
            }
            else if (hp) {
                mode = Mode.HeadingsList;
            }
            if (mode) {
                this.getHandler(mode).validateCommand(inputInfo, index, ft, activeSugg, activeLeaf);
            }
        }
    }
    validateSymbolCommand(inputInfo, activeSugg, activeLeaf) {
        const { mode, inputText } = inputInfo;
        const { symbolListCommand } = this.settings;
        // Standard, Headings, and EditorList mode can have an embedded symbol command
        if (symbolListCommand.length &&
            (mode === Mode.Standard || mode === Mode.EditorList || mode === Mode.HeadingsList)) {
            const escSymbolCmd = escapeRegExp(symbolListCommand);
            // regex that matches symbol command, and extract filter text
            // @(?<ft>.*)$
            const match = new RegExp(`${escSymbolCmd}(?<ft>.*)$`).exec(inputText);
            if (match?.groups) {
                const { index, groups: { ft }, } = match;
                this.getHandler(Mode.SymbolList).validateCommand(inputInfo, index, ft, activeSugg, activeLeaf);
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
                if (key.key === 'Enter' && (modifiers === 'Meta' || modifiers === 'Shift')) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R5cGVzL3NoYXJlZFR5cGVzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL3V0aWxzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2Zyb250TWF0dGVyUGFyc2VyLnRzIiwiLi4vLi4vc3JjL3V0aWxzL3BhbmVsVXRpbHMudHMiLCIuLi8uLi9zcmMvc2V0dGluZ3Mvc3dpdGNoZXJQbHVzU2V0dGluZ3MudHMiLCIuLi8uLi9zcmMvc2V0dGluZ3Mvc3dpdGNoZXJQbHVzU2V0dGluZ1RhYi50cyIsIi4uLy4uL3NyYy9IYW5kbGVycy93b3Jrc3BhY2VIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL0hhbmRsZXJzL2hlYWRpbmdzSGFuZGxlci50cyIsIi4uLy4uL3NyYy9IYW5kbGVycy9lZGl0b3JIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL0hhbmRsZXJzL3N5bWJvbEhhbmRsZXIudHMiLCIuLi8uLi9zcmMvc3dpdGNoZXJQbHVzL2lucHV0SW5mby50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvbW9kZUhhbmRsZXIudHMiLCIuLi8uLi9zcmMvc3dpdGNoZXJQbHVzL2tleW1hcC50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvc3dpdGNoZXJQbHVzLnRzIiwiLi4vLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiTW9kYWwiLCJmdXp6eVNlYXJjaCIsInNvcnRTZWFyY2hSZXN1bHRzIiwicmVuZGVyUmVzdWx0cyIsIlBsYXRmb3JtIiwicHJlcGFyZVF1ZXJ5IiwiZGVib3VuY2UiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFnQkEsSUFBWSxJQU1YO0FBTkQsV0FBWSxJQUFJO0lBQ2QsdUNBQVksQ0FBQTtJQUNaLDJDQUFjLENBQUE7SUFDZCwyQ0FBYyxDQUFBO0lBQ2QsaURBQWlCLENBQUE7SUFDakIsZ0RBQWlCLENBQUE7QUFDbkIsQ0FB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
