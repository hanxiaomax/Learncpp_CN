---
title: 16.3 - 聚合关系
alias: 16.3 - 聚合关系
origin: /aggregation/
origin_title: "16.3 — Aggregation"
time: 2022-7-13
type: translation
tags:
- object
- aggregation
---


??? note "关键点速记"
	
	- 聚合关系中部分可以属于多个整体，其生命周期也独立于整体
	- 实现聚合关系是基于指针和引用的，其他地方都和组合关系一样


在 [[16-2-composition|16.2 - 组合关系]] 中我们指出，对象组合是基于简单对象创建复杂对象的一种方法。同时，我们还介绍了一种类型的对象组合——组合。在组合关系中，整体对象要负责管理部分对象的存在性。

在本节课中，我们会介绍另外一种对象组合——聚合。

## 聚合

聚合关系要满足如下几个条件：

- 部分（成员）是整体对象的一部分；
- 部分（成员）可以不只属于一个整体对象；
- 部分（成员）的生命周期不由整体对象管理；
- 部分（成员）不需要知道整体对象的存在性；

和组合类似，聚合也是一种”部分与整体“的关系，部分被包含在整体中，而且这是一种单向的关系。但是，和组合不同，聚合对象可以同时属于多个整体，而且整体对象不需要负责管理部分对象的生命周期。当聚合关系被创建时，整体不负责创建部分。当聚合关系被破坏时，整体也不负责销毁部分。

举例来说，考虑某个人和它住址之间的关系。简单来说，一个人有一个住址。但是住址可以同时属于多个人，例如你和你的室友，或者是其他人。而且，住址也不是被人管理的——其地址甚至早于居住人就存在了，而且人不在的时候地址仍然会继续存在。因此，我们上面描述的是一种聚合关系。

另外，考虑汽车和引擎的关系。汽车的引擎属于汽车的一部分。但是尽管引擎是汽车的一部分，它也可以属于其他人或物。例如，引擎也属于车主。汽车本身并不负责创建或销毁引擎。不仅如此，尽管车辆知道它会有一个引擎，但是引擎却不知道它是汽车的一部分。

当我们讨论对物理对象建模的时候，使用”销毁“一词会比较奇怪。此时有的人可能会抬杠说，如果一个陨石撞击地球正好砸到了你的车，那岂不是车和引擎一起被销毁了？当然，不过这是陨石的错。这里的关键点在于，汽车不负责销毁其部件（外力是可能的）。

我们可以说，聚合模型是一种”有一个“的关系（院系有一个老师、汽车有一个引擎）。

类似组合关系，聚合中的部分可以是一个也可以是多个。

## 实现聚合关系

因为聚合类似于组合，它们都是部分-整体关系，所以它们的实现几乎完全相同，它们之间的区别主要是语义上的。在组合中，我们通常使用普通成员变量(或由组合类处理分配和回收过程的指针)将部件添加到组合中。

在聚合中，我们仍然使用成员变量表示部分对象。但是，==这些成员变量通常是引用或指针==，用于指向在类的作用域之外创建的对象。因此，聚合通常要么接受它将要指向的对象作为构造函数参数，要么以空开始，然后通过访问函数或操作符添加子对象。

因为这些部分对象存在于类的作用域之外，所以当类被销毁时，指针或引用成员变量将被销毁(但不会被删除)。因此，这些部分本身仍然存在。

让我们仔细研究一个“教师和院系”的示例。在这个例子中，我们将做一些简化：首先，院系将只容纳一名教师。其次，老师不知道他们是哪个院系的。

```cpp
#include <iostream>
#include <string>

class Teacher
{
private:
  std::string m_name{};

public:
  Teacher(const std::string& name)
      : m_name{ name }
  {
  }

  const std::string& getName() const { return m_name; }
};

class Department
{
private:
  const Teacher& m_teacher; // This dept holds only one teacher for simplicity, but it could hold many teachers

public:
  Department(const Teacher& teacher)
      : m_teacher{ teacher }
  {
  }
};

int main()
{
  // Create a teacher outside the scope of the Department
  Teacher bob{ "Bob" }; // create a teacher

  {
    // Create a department and use the constructor parameter to pass
    // the teacher to it.
    Department department{ bob };

  } // department goes out of scope here and is destroyed

  // bob still exists here, but the department doesn't

  std::cout << bob.getName() << " still exists!\n";

  return 0;
}
```

在这个例子中 `bob` 的创建是独立于 `department` 的，它通过构造函数被传递给了 `department`。当 `department` 销毁的时候引用 `m_teacher`被销毁了，但是 teacher 本身并没有被销毁，它仍然存在并且在`main()`结束时被销毁。

## 对象建模时应当选择正确的对象关系

尽管在上面的例子中，教师不知道他们在为哪个系工作，这听起来有点蠢，但在给定的项目上下文中，这可能完全没问题。当决定实现某种类型的关系时，实现满足你需求的最简单的关系，而不是看起来最符合实际环境的关系。

例如，如果你正在编写一个车间模拟器，则将汽车和引擎作为一个聚合是恰当的，这样引擎就可以被从汽车中移除并放在某个架子上以备以后使用。然而，如果你正在编写模拟赛车游戏，那可能将汽车和引擎作为组合实现更恰当，因为在该语境中，引擎不会独立存在于汽车之外。

!!! success "最佳实践"

	==实现满足程序需要的最简单的关系类型，而不是在现实生活中看起来正确的关系类型。==

## 小结：组合和聚合

组合:

-   通常使用普通的成员变量； 
-   如果类自己管理成员对象的内存申请释放，也可以使用指针；
-   负责部分对象的创建和销毁。

聚合:

-  通常使用指针和引用成员并指向存在于整体对象作用域之外的对象；
-  不负责部分对象的创建和销毁。

==值得注意的是，组合和聚合的概念可以在同一个类中自由混合使用==。编写一个负责创建/销毁某些部分而不负责其他部分的类是可以的。例如，我们的`Department`类可以有一个`name`和一个`Teacher` 成员。这个`name`通常是作为组合关系添加到该类中的并且和`Department`一起创建和销毁。另一方面，`Teacher` 将通过聚合的方式添加到`Department`中，并独立地创建/销毁。

虽然聚合可能非常有用，但它们也更危险，因为聚合不处理其部分对象的回收，其销毁操作被分配外部去做了，如果外部不再有指向该部分的指针或引用，或者它只是忘记进行清理(假设类将处理此操作)，那么内存将会泄漏。

因此，应该多用组合少用聚合。


## 提醒和勘误

由于各种各样的历史原因，组聚合的定义并不精确——因此您可能会看到其他参考材料对它的定义与我们所做的不同。没关系，只是要注意。

For a variety of historical and contextual reasons, unlike a composition, the definition of an aggregation is not precise -- so you may see other reference material define it differently from the way we do. That’s fine, just be aware.

One final note: In the lesson [[10-5-Introduction-to-structs-members-and-member-selection|10.5 - 结构体、成员和成员选择]] we defined aggregate data types (such as structs and classes) as data types that group multiple variables together. You may also run across the term aggregate class in your C++ journeys, which is defined as a struct or class that has no provided constructors, destructors, or overloaded assignment, has all public members, and does not use inheritance -- essentially a plain-old-data struct. Despite the similarities in naming, aggregates and aggregation are different and should not be confused.

## `std::reference_wrapper`

In the `Department`/`Teacher` example above, we used a reference in the `Department` to store the `Teacher`. This works fine if there is only one `Teacher`, but what if a Department has multiple Teachers? We’d like to store those Teachers in a list of some kind (e.g. a `std::vector`) but fixed arrays and the various standard library lists can’t hold references (because list elements must be assignable, and references can’t be reassigned).

```cpp
std::vector<const Teacher&> m_teachers{}; // Illegal
```

COPY

Instead of references, we could use pointers, but that would open the possibility to store or pass null pointers. In the `Department`/`Teacher` example, we don’t want to allow null pointers. To solve this, there’s `std::reference_wrapper`.

Essentially, `std::reference_wrapper` is a class that acts like a reference, but also allows assignment and copying, so it’s compatible with lists like `std::vector`.

The good news is that you don’t really need to understand how it works to use it. All you need to know are three things:

1.  `std::reference_wrapper` lives in the `<functional>` header.
2.  When you create your `std::reference_wrapper` wrapped object, the object can’t be an anonymous object (since anonymous objects have expression scope, and this would leave the reference dangling).
3.  When you want to get your object back out of `std::reference_wrapper`, you use the `get()` member function.

Here’s an example using `std::reference_wrapper` in a `std::vector`:

```cpp
#include <functional> // std::reference_wrapper
#include <iostream>
#include <vector>
#include <string>

int main()
{
  std::string tom{ "Tom" };
  std::string berta{ "Berta" };

  std::vector<std::reference_wrapper<std::string>> names{ tom, berta }; // these strings are stored by reference, not value

  std::string jim{ "Jim" };

  names.push_back(jim);

  for (auto name : names)
  {
    // Use the get() member function to get the referenced string.
    name.get() += " Beam";
  }

  std::cout << jim << '\n'; // Jim Beam

  return 0;
}
```

COPY

To create a vector of const references, we’d have to add const before the `std::string` like so

```cpp
// Vector of const references to std::string
std::vector<std::reference_wrapper<const std::string>> names{ tom, berta };
```