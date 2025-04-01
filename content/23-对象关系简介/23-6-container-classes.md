---
title: 16.6 - 容器类
alias: 16.6 - 容器类
origin: /dependencies/
origin_title: "16.6 — Container classes"
time: 2022-5-31
type: translation
tags:
- object
- container classes
---


> [!note] "Key Takeaway"

在现实生活中我们经常会用到容器。麦片是装在盒子里的，书也有封面和装订，你的车库里应该也装了不少东西吧。如果没有容器，使用这些东西的时候一定会非常的混乱。容器最大的功能，就是帮助我们组织和存储存在容器中的东西。

类似的，[[container-class|容器类]]是一种被设计用来存放和组织多种其他类型（可以是类也可以是基本数据类型）实例的类。容器类的种类有很多，每种都有其自己的优势和劣势，以及使用限制。到目前为止，最有用的容器是数组，你在前面的例子中以及多次使用它了。尽管C++ 提供了内建的数组功能，程序员却大多使用数组容器类（`std::array` 或`std::vector`) 。和内建的数组不同，这些数组容器类通常可以动态地调整其大小（当资源被添加或删除时）、可以在传递到函数时保留其大小信息，还可以进行边界检查。这些功能不但使得数组容器类简单易用，而且安全性也更好。

容器类通常会实现一系列标准的、最小化的功能。大多数实现良好的容器类通常包括下面这些功能：

- 创建一个空的容器（通过[[constructor|构造函数]]）；
- 向容器添加一个对象；
- 从容器中删除一个对象；
- 报告容器中对象的个数；
- 清空容器；
- 提供存储对象的访问方式；
- 元素排序（可选的）。

有些容器会忽略上述功能中的某些。例如，数组容器类通常会忽略插入和删除操作，因为数组数据结构在进行插入和删除时效率很低，所以类的设计者不鼓励我们使用这两种操作。

容器类实现了一种**成员关系**。例如，数组中的元素是该数组的一个成员（属于）。注意，我们这里说的成员是平常意义上的成员，而不是指[[14-2-classes-and-class-members|类成员]]。


## 容器类型

==容器类通常有两个变种。[[value-container|值容器]]是[[23-2-composition|组合关系]]，它存放了其元素的拷贝（因此必须负责创建和销毁这些拷贝）。[[reference-container|引用容器]]则是[[23-3-aggregation|聚合关系]]，它保存了元素的指针或引用（因此无需操心它们的创建和销毁）。==

## 数组容器类

在这个例子中，我们会从头编写一个整型数组类并实现它应该提供的大部分功能。该数组类是一个[[value-container|值容器]]，它保存元素的拷贝。和它们的名字暗示的那样，这个容器会保存一个整型数构成的数组，类似`std::vector<int>`。

首先，让我们创建 `IntArray.h` 文件：

```cpp
#ifndef INTARRAY_H
#define INTARRAY_H

class IntArray
{
};

#endif
```


`IntArray` 需要追踪两个值：数据和数组大小。因为我们希望数组能够改变其大小，所以我们必须动态分配内存，因此必须使用指针来保存数据。


```cpp
#ifndef INTARRAY_H
#define INTARRAY_H

class IntArray
{
private:
    int m_length{};
    int* m_data{};
};

#endif
```

接下来，添加用于创建`IntArrays`的构造函数。这里我们需要两个构造函数，一个创建空的数组，一个则创建预定义长度的数组。

```cpp
#ifndef INTARRAY_H
#define INTARRAY_H

#include <cassert> // for assert()

class IntArray
{
private:
    int m_length{};
    int* m_data{};

public:
    IntArray() = default;

    IntArray(int length):
        m_length{ length }
    {
        assert(length >= 0);

        if (length > 0)
            m_data = new int[length]{};
    }
};

#endif
```


我们还需要创建用于清理数组的函数。首先，定义一个[[destructor|析构函数]]，它的功能就是释放数据占用的内存。然后，再编写一个`erase()`函数将数组的元素清除并将长度设置为0。

```cpp
~IntArray()
{
    delete[] m_data;
    // 这里不必将 m_data 设置为 null 也不用将 m_length 设置为0，因为对象马上就会被销毁

}

void erase()
{
    delete[] m_data;

    // 必须确保  m_data 是 nullptr 否则将会称为悬垂指针
    m_data = nullptr;
    m_length = 0;
}
```


现在，[[overload|重载]]`[]`操作符用于访问数组中的元素。在重载下标运算符的时候，必须确保索引是合法的，该操作可以使用`assert()`函数。我们还需要添加一个函数用于返回数组长度。这样一来，类看上去会向下面这样：

```cpp
#ifndef INTARRAY_H
#define INTARRAY_H

#include <cassert> // for assert()

class IntArray
{
private:
    int m_length{};
    int* m_data{};

public:
    IntArray() = default;

    IntArray(int length):
        m_length{ length }
    {
        assert(length >= 0);

        if (length > 0)
            m_data = new int[length]{};
    }

    ~IntArray()
    {
        delete[] m_data;
        // 这里不必将 m_data 设置为 null 也不用将 m_length 设置为0，因为对象马上就会被销毁
    }

    void erase()
    {
        delete[] m_data;
        // 必须确保  m_data 是 nullptr 否则将会称为悬垂指针
        m_data = nullptr;
        m_length = 0;
    }

    int& operator[](int index)
    {
        assert(index >= 0 && index < m_length);
        return m_data[index];
    }

    int getLength() const { return m_length; }
};

#endif
```


至此，`IntArray` 类已经实现完成，可以使用了。我们可以创建一个有预定义长度的 `IntArrays`，然后使用下标运算符获取元素的值。

但是，`IntArray` 仍然还有些功能没有被实现。数组大小暂时还不能改变、数组中的元素也还不能被插入或删除、不仅如此，数组元素也还不能被排序。

首先，编写代码使得数组可以改变其尺寸。而且，我们会实现两个不同的函数来实现这一功能。第一个函数是 `reallocate()`，这个函数在调整数组大小的时候，会销毁数组中的全部元素，但是它的速度很快。第二个函数是 `resize()`，它在调整数组大小的时候，它会保持数组中的元素，但是该函数的效率会低一些。

```cpp
// reallocate 会调整数组大小，但是它会在工作时销毁所有的数组元素。该函数的速度很快
void reallocate(int newLength)
{
    // 首先，删除全部的元素
    erase();

    // 如果要创建空数组，此处返回即可
    if (newLength <= 0)
        return;

    // 分配新的元素
    m_data = new int[newLength];
    m_length = newLength;
}

// resize 会调整数组大小，数组中的元素会被保存下来。该函数的速度比较慢
void resize(int newLength)
{
    // 如果数组的长度已经满足要求，完成
    if (newLength == m_length)
        return;

    // 如果需要将数组调整为一个空数组，完成并返回
    if (newLength <= 0)
    {
        erase();
        return;
    }

    // 假设 newLength 大于等于1。该算法的原理如下：
    // 首先，分配一个新的数组。然后将旧数组中的元素都拷贝到新的数组中。完成后，销毁旧数组。
    // 然后让 m_data 指向新的数组

    // 分配一个新的数组
    int* data{ new int[newLength] };

    // 确定有多少个元素需要从旧数组中拷贝到新数组。
    // 这里我们希望从旧数组中拷贝尽可能多的元素（新数组不一定比旧数组大）
    // 拷贝的元素个数是新旧两个数组中较小的一个
    if (m_length > 0)
    {
        int elementsToCopy{ (newLength > m_length) ? m_length : newLength };

        // Now copy the elements one by one
        for (int index{ 0 }; index < elementsToCopy; ++index)
            data[index] = m_data[index];
    }

    // 删除旧数组
    delete[] m_data;

    // 开始使用新的数组作为数据！最简单的办法就是让 m_data指向新数组的地址。
    // 由于该数组是动态分配的，所以不会在离开作用域时被销毁
    m_data = data;
    m_length = newLength;
}
```


还挺复杂！

多数的数组容器类会止步于此。不过，也许你想知道插入和删除操作应该如何实现，所以我们继续实现这两个功能。其实现方法和`resize()`非常类似。

```cpp
void insertBefore(int value, int index)
{
    // 检查数组索引合法性
    assert(index >= 0 && index <= m_length);

    // 首先创建一个新的数组，其长度比旧数组大1
    int* data{ new int[m_length+1] };

    // 拷贝到当前索引的所有元素
    for (int before{ 0 }; before < index; ++before)
        data[before] = m_data[before];

    // 插入新的元素到新数组
    data[index] = value;

    // 继续拷贝剩余的元素
    for (int after{ index }; after < m_length; ++after)
        data[after+1] = m_data[after];

    // 最后，删除旧数组，然后使用新的数组作为数据
    delete[] m_data;
    m_data = data;
    ++m_length;
}

void remove(int index)
{
    // 检查数组索引合法性
    assert(index >= 0 && index < m_length);

    // 如果这已经是最后一个数组元素，将数组设置为空数组然后完成
    if (m_length == 1)
    {
        erase();
        return;
    }

    // 创建一个新数组，其大小比旧数组小1
    int* data{ new int[m_length-1] };

    // 拷贝到索引的全部元素
    for (int before{ 0 }; before < index; ++before)
        data[before] = m_data[before];

    // 继续拷贝被删除元素后面的所有元素
    for (int after{ index+1 }; after < m_length; ++after)
        data[after-1] = m_data[after];

    // 最后，删除旧数组并使用新的数组作为数据
    delete[] m_data;
    m_data = data;
    --m_length;
}

// A couple of additional functions just for convenience
void insertAtBeginning(int value) { insertBefore(value, 0); }
void insertAtEnd(int value) { insertBefore(value, m_length); }
```

`IntArray` 容器类的完整定义如下：

```cpp title="IntArray.h"
#ifndef INTARRAY_H
#define INTARRAY_H

#include <cassert> // for assert()

class IntArray
{
private:
    int m_length{};
    int* m_data{};

public:
    IntArray() = default;

    IntArray(int length):
        m_length{ length }
    {
        assert(length >= 0);
        if (length > 0)
            m_data = new int[length]{};
    }

    ~IntArray()
    {
        delete[] m_data;
        // we don't need to set m_data to null or m_length to 0 here, since the object will be destroyed immediately after this function anyway
    }

    void erase()
    {
        delete[] m_data;
        // We need to make sure we set m_data to nullptr here, otherwise it will
        // be left pointing at deallocated memory!
        m_data = nullptr;
        m_length = 0;
    }

    int& operator[](int index)
    {
        assert(index >= 0 && index < m_length);
        return m_data[index];
    }

    // reallocate resizes the array.  Any existing elements will be destroyed.  This function operates quickly.
    void reallocate(int newLength)
    {
        // First we delete any existing elements
        erase();

        // If our array is going to be empty now, return here
        if (newLength <= 0)
            return;

        // Then we have to allocate new elements
        m_data = new int[newLength];
        m_length = newLength;
    }

    // resize resizes the array.  Any existing elements will be kept.  This function operates slowly.
    void resize(int newLength)
    {
        // if the array is already the right length, we're done
        if (newLength == m_length)
            return;

        // If we are resizing to an empty array, do that and return
        if (newLength <= 0)
        {
            erase();
            return;
        }

        // Now we can assume newLength is at least 1 element.  This algorithm
        // works as follows: First we are going to allocate a new array.  Then we
        // are going to copy elements from the existing array to the new array.
        // Once that is done, we can destroy the old array, and make m_data
        // point to the new array.

        // First we have to allocate a new array
        int* data{ new int[newLength] };

        // Then we have to figure out how many elements to copy from the existing
        // array to the new array.  We want to copy as many elements as there are
        // in the smaller of the two arrays.
        if (m_length > 0)
        {
            int elementsToCopy{ (newLength > m_length) ? m_length : newLength };

            // Now copy the elements one by one
            for (int index{ 0 }; index < elementsToCopy; ++index)
                data[index] = m_data[index];
        }

        // Now we can delete the old array because we don't need it any more
        delete[] m_data;

        // And use the new array instead!  Note that this simply makes m_data point
        // to the same address as the new array we dynamically allocated.  Because
        // data was dynamically allocated, it won't be destroyed when it goes out of scope.
        m_data = data;
        m_length = newLength;
    }

    void insertBefore(int value, int index)
    {
        // Sanity check our index value
        assert(index >= 0 && index <= m_length);

        // First create a new array one element larger than the old array
        int* data{ new int[m_length+1] };

        // Copy all of the elements up to the index
        for (int before{ 0 }; before < index; ++before)
            data[before] = m_data[before];

        // Insert our new element into the new array
        data[index] = value;

        // Copy all of the values after the inserted element
        for (int after{ index }; after < m_length; ++after)
            data[after+1] = m_data[after];

        // Finally, delete the old array, and use the new array instead
        delete[] m_data;
        m_data = data;
        ++m_length;
    }

    void remove(int index)
    {
        // Sanity check our index value
        assert(index >= 0 && index < m_length);

        // If we're removing the last element in the array, we can just erase the array and return early
        if (m_length == 1)
        {
            erase();
            return;
        }

        // First create a new array one element smaller than the old array
        int* data{ new int[m_length-1] };

        // Copy all of the elements up to the index
        for (int before{ 0 }; before  < index; ++before)
            data[before] = m_data[before];

        // Copy all of the values after the removed element
        for (int after{ index+1 }; after < m_length; ++after)
            data[after-1] = m_data[after];

        // Finally, delete the old array, and use the new array instead
        delete[] m_data;
        m_data = data;
        --m_length;
    }

    // A couple of additional functions just for convenience
    void insertAtBeginning(int value) { insertBefore(value, 0); }
    void insertAtEnd(int value) { insertBefore(value, m_length); }

    int getLength() const { return m_length; }
};

#endif
```


试试看，能不能正确工作！

```cpp
#include <iostream>
#include "IntArray.h"

int main()
{
    // Declare an array with 10 elements
    IntArray array(10);

    // Fill the array with numbers 1 through 10
    for (int i{ 0 }; i<10; ++i)
        array[i] = i+1;

    // Resize the array to 8 elements
    array.resize(8);

    // Insert the number 20 before element with index 5
    array.insertBefore(20, 5);

    // Remove the element with index 3
    array.remove(3);

    // Add 30 and 40 to the end and beginning
    array.insertAtEnd(30);
    array.insertAtBeginning(40);

    // Print out all the numbers
    for (int i{ 0 }; i<array.getLength(); ++i)
        std::cout << array[i] << ' ';

    std::cout << '\n';

    return 0;
}
```

程序运行结果：

```
40 1 2 3 5 20 6 7 8 30
```

虽然编写一个容器类是非常复杂的事情，好消息是你只需要编写一次即可。一旦某个容器类可以正常工作了。那么你接下来就可以不断地使用它了。

尽管我们的 `IntArray` 容器中存放的是基本数据类型 (`int`)，我们其实也可以使用用户定义类型(例如 `Point` 类).

还有一件事：如果标准库中的一个类可以满足你的需求，那你应该直接使用它而不是创建自己的类。例如，与其使用 `IntArray`，不如使用 `std::vector<int>`。它是经过检验的，效率很高，并且与标准库中的其他类可以很好地配合。但有时你需要标准库中不存在的专用容器类，因此最好知道在需要时如何创建自己的容器类。在介绍了一些更基本的主题之后，我们将更多地讨论标准库中的容器。
