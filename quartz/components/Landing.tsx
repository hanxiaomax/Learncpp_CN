import { QuartzComponentConstructor, QuartzComponent, QuartzComponentProps } from "./types"
import landingStyle from "./styles/landing.scss"
import { FullSlug, resolveRelative } from "../util/path"

export const TOTAL_CARDS = 8

// 定义卡片内容和类型
interface CardMap {
  [key: string]: (fileData: any) => JSX.Element
}

export const CARDS: CardMap = {
  "01-CPP-Basic": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "01-CPP-Basic" as FullSlug)}>
      <div class="card card-1">
        <p class="card-title">1. C++ 基础</p>
        <p class="card-subhead">章节 01</p>
        <div class="card-illustration-1"></div>
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
      <div class="card card-2">
        <p class="card-title">2. C++ 基础——函数和文件</p>
        <p class="card-subhead">章节 02</p>
        <div class="card-illustration-2"></div>
      </div>
    </a>
  ),
  "03-Debuging": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "03-Debuging" as FullSlug)}>
      <div class="card card-3">
        <p class="card-title">3. 调试 C++ 程序</p>
        <p class="card-subhead">章节 03</p>
        <div class="card-illustration-3"></div>
      </div>
    </a>
  ),
  "04-Basic-Data-Type": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "04-Basic-Data-Type" as FullSlug)}>
      <div class="card card-4">
        <p class="card-title">4. 基础数据类型 </p>
        <p class="card-subhead">章节 04</p>
        <div class="card-illustration-4"></div>
      </div>
    </a>
  ),
  "05-Operator": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "05-Operator" as FullSlug)}>
      <div class="card card-5">
        <p class="card-title">5. 运算符</p>
        <p class="card-subhead">章节 05</p>
        <div class="card-illustration-5"></div>
      </div>
    </a>
  ),
  "06-Scope": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "06-Scope" as FullSlug)}>
      <div class="card card-6">
        <p class="card-title">6. 作用域、生命周期和链接</p>
        <p class="card-subhead">章节 06</p>
        <div class="card-illustration-6"></div>
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
      <div class="card card-1">
        <p class="card-title">7. 控制流和错误处理</p>
        <p class="card-subhead">章节 07</p>
        <div class="card-illustration-1"></div>
      </div>
    </a>
  ),
  "08-Casting-and-Override": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "08-Casting-and-Override" as FullSlug)}>
      <div class="card card-2">
        <p class="card-title">8. 类型转换和函数重载 </p>
        <p class="card-subhead">章节 08</p>
        <div class="card-illustration-2"></div>
      </div>
    </a>
  ),
  "09-Reference-and-Pointer": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "09-Reference-and-Pointer" as FullSlug)}>
      <div class="card card-3">
        <p class="card-title">9. 复合类型-引用和指针 </p>
        <p class="card-subhead">章节 09</p>
        <div class="card-illustration-3"></div>
      </div>
    </a>
  ),
  "10-Enum-and-Struct": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "10-Enum-and-Struct" as FullSlug)}>
      <div class="card card-4">
        <p class="card-title">10. 复合类型-枚举和结构体 </p>
        <p class="card-subhead">章节 10</p>
        <div class="card-illustration-4"></div>
      </div>
    </a>
  ),
  "11-Array-String": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "11-Array-String" as FullSlug)}>
      <div class="card card-5">
        <p class="card-title">11. 数组，字符串和动态内存分配</p>
        <p class="card-subhead">章节 11</p>
        <div class="card-illustration-5"></div>
      </div>
    </a>
  ),
  "12-Function": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "12-Function" as FullSlug)}>
      <div class="card card-6">
        <p class="card-title">12. 函数</p>
        <p class="card-subhead">章节 12</p>
        <div class="card-illustration-6"></div>
      </div>
    </a>
  ),
  "13-OOP": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "13-OOP" as FullSlug)}>
      <div class="card card-1">
        <p class="card-title">13. 面向对象编程基础</p>
        <p class="card-subhead">章节 13</p>
        <div class="card-illustration-1"></div>
      </div>
    </a>
  ),
  "14-Operator-Override": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "14-Operator-Override" as FullSlug)}>
      <div class="card card-2">
        <p class="card-title">14. 操作符重载</p>
        <p class="card-subhead">章节 14</p>
        <div class="card-illustration-2"></div>
      </div>
    </a>
  ),
  "16-Object-Releation": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "16-Object-Releation" as FullSlug)}>
      <div class="card card-3">
        <p class="card-title">16. 对象关系简介 </p>
        <p class="card-subhead">章节 16</p>
        <div class="card-illustration-3"></div>
      </div>
    </a>
  ),
  "17-Inherit": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "17-Inherit" as FullSlug)}>
      <div class="card card-4">
        <p class="card-title">17. 继承</p>
        <p class="card-subhead">章节 17</p>
        <div class="card-illustration-4"></div>
      </div>
    </a>
  ),
  "18-Virtual-Function": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "18-Virtual-Function" as FullSlug)}>
      <div class="card card-5">
        <p class="card-title">18. 虚函数 </p>
        <p class="card-subhead">章节 18</p>
        <div class="card-illustration-5"></div>
      </div>
    </a>
  ),
  "19-Template": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "19-Template" as FullSlug)}>
      <div class="card card-6">
        <p class="card-title">19. 模板和类</p>
        <p class="card-subhead">章节 19</p>
        <div class="card-illustration-6"></div>
      </div>
    </a>
  ),
  "20-Exception": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "20-Exception" as FullSlug)}>
      <div class="card card-1">
        <p class="card-title">20. 异常</p>
        <p class="card-subhead">章节 20</p>
        <div class="card-illustration-1"></div>
      </div>
    </a>
  ),
  "21-STL": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "21-STL" as FullSlug)}>
      <div class="card card-2">
        <p class="card-title">21. STL </p>
        <p class="card-subhead">章节 21</p>
        <div class="card-illustration-2"></div>
      </div>
    </a>
  ),
  "22-STD-String": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "22-STD-String" as FullSlug)}>
      <div class="card card-3">
        <p class="card-title">22. std 字符串 </p>
        <p class="card-subhead">章节 22</p>
        <div class="card-illustration-3"></div>
      </div>
    </a>
  ),
  "23-IO": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "23-IO" as FullSlug)}>
      <div class="card card-4">
        <p class="card-title">23. 输入输出</p>
        <p class="card-subhead">章节 23</p>
        <div class="card-illustration-4"></div>
      </div>
    </a>
  ),
  "A-Misc": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "A-Misc" as FullSlug)}>
      <div class="card card-5">
        <p class="card-title">A. 其他话题 </p>
        <p class="card-subhead">附录 A</p>
        <div class="card-illustration-5"></div>
      </div>
    </a>
  ),
  "B-CPP-Standart": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "B-CPP-Standard" as FullSlug)}>
      <div class="card card-6">
        <p class="card-title">B. C++标准更新</p>
        <p class="card-subhead">附录 B</p>
        <div class="card-illustration-6"></div>
      </div>
    </a>
  ),
  "M-Move-and-Smart-Pointer": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "M-Move-and-Smart-Pointer" as FullSlug)}>
      <div class="card card-1">
        <p class="card-title">M. move 和智能指针 </p>
        <p class="card-subhead"></p>
        <div class="card-illustration-1"></div>
      </div>
    </a>
  ),
  "O1-Bit-Operation": (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "O1-Bit-Operation" as FullSlug)}>
      <div class="card card-2">
        <p class="card-title">O1. 位运算</p>
        <p class="card-subhead">附录 O1</p>
        <div class="card-illustration-2"></div>
      </div>
    </a>
  ),
  Templates: (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "Templates" as FullSlug)}>
      <div class="card card-3">
        <p class="card-title">Templates</p>
        <p class="card-subhead">模板</p>
        <div class="card-illustration-3"></div>
      </div>
    </a>
  ),
  Glossary: (fileData: any) => (
    <a href={resolveRelative(fileData.slug as FullSlug, "Glossary" as FullSlug)}>
      <div class="card card-4">
        <p class="card-title">Glossary</p>
        <p class="card-subhead">术语表</p>
        <div class="card-illustration-4"></div>
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
          <span>这是一个指南</span>
          <span> • </span>
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

              return (
                <a href={resolveRelative(fileData.slug as FullSlug, folder as FullSlug)}>
                  <div class={`card card-${parseInt(folderNumber) % 6 || 1}`}>
                    <p class="card-title">{displayName}</p>
                    <p class="card-subhead">章节 {folderNumber}</p>
                    <div class={`card-illustration-${parseInt(folderNumber) % 6 || 1}`}></div>
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
