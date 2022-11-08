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
	
	-


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

当我们讨论对物理对象建模的时候，使用”销毁“一词会比较奇怪。此时有的人可能会抬杠说，如果一个小行星撞击地球正好砸到了你的车，那岂不是车和引擎一起被销毁了？当然，不过这是陨石的错。es, of course. But that’s the fault of the meteor. The important point is that the car is not responsible for destruction of its parts (but an external force might be).

We can say that aggregation models “has-a” relationships (a department has teachers, the car has an engine).

Similar to a composition, the parts of an aggregation can be singular or multiplicative.

## 实现组合关系

Because aggregations are similar to compositions in that they are both part-whole relationships, they are implemented almost identically, and the difference between them is mostly semantic. In a composition, we typically add our parts to the composition using normal member variables (or pointers where the allocation and deallocation process is handled by the composition class).

In an aggregation, we also add parts as member variables. However, these member variables are typically either references or pointers that are used to point at objects that have been created outside the scope of the class. Consequently, an aggregation usually either takes the objects it is going to point to as constructor parameters, or it begins empty and the subobjects are added later via access functions or operators.

Because these parts exist outside of the scope of the class, when the class is destroyed, the pointer or reference member variable will be destroyed (but not deleted). Consequently, the parts themselves will still exist.

Let’s take a look at a Teacher and Department example in more detail. In this example, we’re going to make a couple of simplifications: First, the department will only hold one teacher. Second, the teacher will be unaware of what department they’re part of.

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

COPY

In this case, `bob` is created independently of `department`, and then passed into `department`‘s constructor. When `department` is destroyed, the `m_teacher` reference is destroyed, but the teacher itself is not destroyed, so it still exists until it is independently destroyed later in `main()`.

Pick the right relationship for what you’re modeling

Although it might seem a little silly in the above example that the Teachers don’t know what Department they’re working for, that may be totally fine in the context of a given program. When you’re determining what kind of relationship to implement, implement the simplest relationship that meets your needs, not the one that seems like it would fit best in a real-life context.

For example, if you’re writing a body shop simulator, you may want to implement a car and engine as an aggregation, so the engine can be removed and put on a shelf somewhere for later. However, if you’re writing a racing simulation, you may want to implement a car and an engine as a composition, since the engine will never exist outside of the car in that context.

!!! success "最佳实践"

	Implement the simplest relationship type that meets the needs of your program, not what seems right in real-life.

Summarizing composition and aggregation

组合:

-   Typically use normal member variables
-   Can use pointer members if the class handles object allocation/deallocation itself
-   Responsible for creation/destruction of parts

聚合:

-   Typically use pointer or reference members that point to or reference objects that live outside the scope of the aggregate class
-   Not responsible for creating/destroying parts

It is worth noting that the concepts of composition and aggregation can be mixed freely within the same class. It is entirely possible to write a class that is responsible for the creation/destruction of some parts but not others. For example, our Department class could have a name and a Teacher. The name would probably be added to the Department by composition, and would be created and destroyed with the Department. On the other hand, the Teacher would be added to the department by aggregation, and created/destroyed independently.

While aggregations can be extremely useful, they are also potentially more dangerous, because aggregations do not handle deallocation of their parts. Deallocations are left to an external party to do. If the external party no longer has a pointer or reference to the abandoned parts, or if it simply forgets to do the cleanup (assuming the class will handle that), then memory will be leaked.

For this reason, compositions should be favored over aggregations.

A few warnings/errata

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