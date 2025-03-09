import { PluggableList } from "unified"
import { StaticResources } from "../util/resources"
import { ProcessedContent } from "./vfile"
import { QuartzComponent } from "../components/types"
import { FilePath } from "../util/path"
import { BuildCtx } from "../util/ctx"
import DepGraph from "../depgraph"

export interface PluginTypes {
  transformers: QuartzTransformerPluginInstance[]
  filters: QuartzFilterPluginInstance[]
  emitters: QuartzEmitterPluginInstance[]
}

type OptionType = object | undefined
type ExternalResourcesFn = (ctx: BuildCtx) => Partial<StaticResources> | undefined
export type QuartzTransformerPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzTransformerPluginInstance
export type QuartzTransformerPluginInstance = {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx: BuildCtx) => PluggableList
  htmlPlugins?: (ctx: BuildCtx) => PluggableList
  externalResources?: ExternalResourcesFn
}

export type QuartzFilterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzFilterPluginInstance
export type QuartzFilterPluginInstance = {
  name: string
  shouldPublish(ctx: BuildCtx, content: ProcessedContent): boolean
}

export type QuartzEmitterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzEmitterPluginInstance
export type QuartzEmitterPluginInstance = {
  name: string
  emit(ctx: BuildCtx, content: ProcessedContent[], resources: StaticResources): Promise<FilePath[]>
  /**
   * Returns the components (if any) that are used in rendering the page.
   * This helps Quartz optimize the page by only including necessary resources
   * for components that are actually used.
   */
  getQuartzComponents?: (ctx: BuildCtx) => QuartzComponent[]
  getDependencyGraph?(
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
  ): Promise<DepGraph<FilePath>>
  externalResources?: ExternalResourcesFn
}
