---
title: NavigationSplitView's Hidden Trap – Don't Get Stuck Like I Did
author: Christian
date: 2025-05-16
layout: blog
description: NavigationSplitView seems easy to use. And Apple's example projects are. But step just a little outside the basic path, and you can easily run into problems.
published: true
---

I lately ran into some weird behavior with `NavigationSplitView`. The issue happens when using it with a `NavigationStack` in the detail view to add one more level of "drill down."

To have full control over column display, I used two properties in the `NavigationSplitView` init:

```swift
NavigationSplitView(
    columnVisibility: NavigationSplitViewVisibility,
    preferredCompactColumn: NavigationSplitViewColumn
)
```

Here's what I wanted my users to do:
1. Select something on the sidebar
2. Choose an item from the content view
3. On the detail page, either drill down further or go back to sidebar by tapping a `reset` button

Here's my code:

```swift
struct ContentView: View {
    @State var navigationPath = NavigationPath()
    @State var preferredColumn: NavigationSplitViewColumn = .sidebar
    @State var columnVisibility: NavigationSplitViewVisibility = .all

    var body: some View {
        NavigationSplitView(
            columnVisibility: $columnVisibility,
            preferredCompactColumn: $preferredColumn
        ) {
            List {
                Text("First").onTapGesture {
                    preferredColumn = .content
                }
            }
            .navigationTitle("Sidebar")
        } content: {
            List() {
                Text("first content").onTapGesture {
                    preferredColumn = .detail
                }
            }.navigationTitle("Content")
        } detail: {
            NavigationStack(path: $navigationPath) {
                VStack {
                    Text("Detail")
                    Button("Push") {
                        navigationPath.append("More Detail")
                    }
                    Button("Reset") {
                        preferredColumn = .sidebar
                    }
                }
                .navigationTitle("Detail")
                .navigationDestination(for: String.self) { value in
                    Text(value)
                        .navigationTitle("More Detail")
                }
            }
        }
    }
}
```

Nothing special so far. Let's look at the video of the behavior:

![The happy path](/blog/advanced-navigation-split-view-bugs/first.gif)

And now let's see what happens if the user decides to push on the `NavigationStack` and hits the `reset` button afterward.

![The issue](/blog/advanced-navigation-split-view-bugs/second.gif)


Did you see it?

For some reason, the programmatic back navigation stopped working! 

What happened? Once we pushed a view onto the `NavigationStack` and tried to change the `columnVisibility` or `preferredCompactColumn`, it just ignored us. 

The manual back arrow and gesture still work fine though.

## Why is this happening?

I'm not 100% sure what's happening under the hood. After debugging, I found that iOS updates the `preferredCompactColumn` by itself. This happens when you pop the last view off of the `NavigationStack`.

The `NavigationSplitView` seems confused. It thinks this navigation is its own and sets `preferredCompactColumn` to `.content`. But it still shows the `.detail` column on screen! 

Even weirder: updating `preferredCompactColumn` to `.detail` again doesn't fix it. Only manually navigating back and forth will reset things.

## Why is this an issue?

You might use `NavigationSplitView` and never hit this problem. If so, lucky you! 

But this can be a nasty bug whenever you have multiple sections in your app and want to let users quickly jump between them. I'd also argue that with complex navigation, you'll naturally want more control over which columns are displayed and will lean towards the `columnVisibility` and `preferredCompactColumn` API.

## My workaround

There are actually two ways to sail around this issue. The first one is to stick to the selection-based navigation showcased in Apple's documentation:

```swift
struct ContentView: View {
    @State private var department: String?
    @State private var employee: String?

    var body: some View {
        NavigationSplitView {
            List(["HR", "IT", "Sales"], id: \.self, selection: $department) { department in
                Text(department)
            }
        } content: {
            Text(department)
            List(["Alice", "Bob", "Charlie"], id: \.self, selection: $employee) { employee in
                Text(employee)
            }
        } detail: {
            VStack {
                Button("Reset selection") {
                    employee = nil
                    department = nil
                }
                Text(department)
                Text(employee ?? "Nothing Selected")
            }
        }
    }
}
```

This works fine but lacks flexibility. Maybe you don't have lists in your sidebar or content columns. Or maybe your existing navigation patterns don't play well with this selection-based approach.

This is where my dirty workaround comes in. I tried everything to fix this elegantly. But only one thing worked: forcing SwiftUI to re-render the whole `NavigationSplitView`. 

I attached an `.id(:)` to the view that changes before column updates whenever the `NavigationPath` was modified.

```swift
struct ContentView: View {
    ...

    @State var identifier = UUID()

    var body: some View {
        NavigationSplitView(
            columnVisibility: $columnVisibility,
            preferredCompactColumn: $preferredColumn
        ) {
          ...
        } content: {
          ...
        } detail: {
            NavigationStack(path: $navigationPath) {
                VStack {
                    ...
                    Button("Push") {
                      ...
                    }
                    Button("Reset") {
                        identifier = UUID()
                        preferredColumn = .sidebar
                    }
                }
                ...
            }
        }
        .id(identifier)
    }
}
```

While this works, it might cause some UI flickering. So I'm still not completely happy with it.

If there's one takeaway from this post, it's this: stick to selection-based navigation for `NavigationSplitView` when you can make it work with your app architecture. Don't mess with `preferredCompactColumn` if you can avoid it. At least until apple fixes this bug. Your future self will thank you!
