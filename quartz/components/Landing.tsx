import { QuartzComponentConstructor, QuartzComponent, QuartzComponentProps } from "./types"
import landingStyle from "./styles/landing.scss"
import { FullSlug, resolveRelative } from "../util/path"

interface CardMap {
  [key: string]: (fileData: any) => JSX.Element
}

const WIP_CHAPTERS: string[] = []

export const CARDS: CardMap = {
  "01-CPP-Basic": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "01-CPP-Basic" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">C++ 基础</p>
        <p class="card-subhead">章节 01</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "02-CPP-Basic-Function-and-Files": (fileData: any) => (
    <a
      href={resolveRelative(
        fileData.slug as FullSlug,
        "02-CPP-Basic-Function-and-Files" as FullSlug,
      )}
    >
      <div class="card card-published">
        <p class="card-title">C++ 基础函数和文件</p>
        <p class="card-subhead">章节 02</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "03-Debuging": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "03-Debuging" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">调试</p>
        <p class="card-subhead">章节 03</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "04-Basic-Data-Type": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "04-Basic-Data-Type" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">基本数据类型</p>
        <p class="card-subhead">章节 04</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "05-Operator": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "05-Operator" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">运算符</p>
        <p class="card-subhead">章节 05</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "06-Scope": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "06-Scope" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">作用域</p>
        <p class="card-subhead">章节 06</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "07-Control-Flow-and-Error-Handling": (fileData: any) => (
    <a
      href={resolveRelative(
        fileData.slug as FullSlug,
        "07-Control-Flow-and-Error-Handling" as FullSlug,
      )}
    >
      <div class="card card-published">
        <p class="card-title">控制流和错误处理</p>
        <p class="card-subhead">章节 07</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "08-Casting-and-Override": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "08-Casting-and-Override" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">类型转换和重载</p>
        <p class="card-subhead">章节 08</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "09-Reference-and-Pointer": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "09-Reference-and-Pointer" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">引用和指针</p>
        <p class="card-subhead">章节 09</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "10-Enum-and-Struct": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "10-Enum-and-Struct" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">枚举和结构体</p>
        <p class="card-subhead">章节 10</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "11-Array-String": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "11-Array-String" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">数组和字符串</p>
        <p class="card-subhead">章节 11</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "12-Function": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "12-Function" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">函数</p>
        <p class="card-subhead">章节 12</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "13-OOP": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "13-OOP" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">面向对象编程</p>
        <p class="card-subhead">章节 13</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "14-Operator-Override": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "14-Operator-Override" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">运算符重载</p>
        <p class="card-subhead">章节 14 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "16-Object-Releation": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "16-Object-Releation" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">对象关系</p>
        <p class="card-subhead">章节 16 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "17-Inherit": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "17-Inherit" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">继承</p>
        <p class="card-subhead">章节 17 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "18-Virtual-Function": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "18-Virtual-Function" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">虚函数</p>
        <p class="card-subhead">章节 18 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "19-Template": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "19-Template" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">模板</p>
        <p class="card-subhead">章节 19 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "20-Exception": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "20-Exception" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">异常</p>
        <p class="card-subhead">章节 20 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "21-STL": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "21-STL" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">STL</p>
        <p class="card-subhead">章节 21</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "22-STD-String": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "22-STD-String" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">STD String</p>
        <p class="card-subhead">章节 22</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "23-IO": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "23-IO" as FullSlug)}>
      <div class="card card-published">
        <p class="card-title">IO</p>
        <p class="card-subhead">章节 23</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "A-Misc": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "A-Misc" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">其他话题</p>
        <p class="card-subhead">附录 A (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "B-CPP-Standart": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "B-CPP-Standart" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">C++标准更新</p>
        <p class="card-subhead">附录 B (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "M-Move-and-Smart-Pointer": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "M-Move-and-Smart-Pointer" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">move 和智能指针</p>
        <p class="card-subhead">附录 M (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  "O1-Bit-Operation": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "O1-Bit-Operation" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">位运算</p>
        <p class="card-subhead">附录 O1 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  Templates: (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "Templates" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">模板</p>
        <p class="card-subhead">模板 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
  Glossary: (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "Glossary" as FullSlug)}>
      <div class="card card-wip">
        <p class="card-title">术语表</p>
        <p class="card-subhead">术语表 (进行中)</p>
        <div class="card-illustration"></div>
      </div>
    </a>
  ),
}

export default (() => {
  const Landing: QuartzComponent = ({ cfg, fileData, allFiles }: QuartzComponentProps) => {
    const folders = allFiles
      .filter((file) => file.slug !== undefined && file.slug.includes("/"))
      .reduce((acc, file) => {
        if (file.slug) {
          const folderPath = file.slug.split("/")[0]
          if (!acc.includes(folderPath) && !folderPath.startsWith(".")) {
            acc.push(folderPath)
          }
        }
        return acc
      }, [] as string[])
      .sort()

    return (
      <div class="content-container">
        <h1 class="landing-header">欢迎来到 LearnCpp 中文翻译站点</h1>
        <div class="page-subhead">
          <a href="https://www.learncpp.com" target="_blank">
            访问原站
          </a>
          <span> • </span>
          <a href="https://github.com/hanxiaomax/Learncpp_CN" target="_blank">
            贡献翻译
          </a>
          <span> • </span>
          <a href="/翻译约定">翻译约定</a>
        </div>

        <div class="issue-container">
          {folders.map((folder) => {
            if (CARDS[folder]) {
              return CARDS[folder](fileData)
            } else {
              const folderNumber = folder.match(/^(\d+)-/) ? folder.match(/^(\d+)-/)![1] : ""
              const displayName = folder.replace(/^\d+-/, "").replace(/-/g, " ")

              const isWIP = WIP_CHAPTERS.includes(folder)
              const cardClass = isWIP ? "card-wip" : "card-published"
              const statusText = isWIP ? " (完善中)" : ""

              return (
                <a href={resolveRelative(fileData.slug as FullSlug, folder as FullSlug)}>
                  <div class={`card ${cardClass}`}>
                    <p class="card-title">{displayName}</p>
                    <p class="card-subhead">
                      章节 {folderNumber}
                      {statusText}
                    </p>
                    <div class="card-illustration"></div>
                  </div>
                </a>
              )
            }
          })}
        </div>
      </div>
    )
  }

  Landing.css = landingStyle
  return Landing
}) satisfies QuartzComponentConstructor
