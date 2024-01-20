# Get Started

## Define a Schema

```ts
import z from "zod"
import {IdField} from "@localful/common"
import {LocalfulWeb} from "@localful/web"

export const Note = z.object({
  name: z.string(),
  body: z.string(),
  tags: z.array(IdField)
}).strict()
export type Note = z.infer<typeof Note>

export const Tag = z.object({
  name: z.string(),
}).strict()
export type Tag = z.infer<typeof Tag>

export const localful = new LocalfulWeb({
  dataSchema: {
    notes: {
      version: '1', 
      schema: Note,
    },
    tags: {
      version: '1', 
      schema: Tag
    }
  }
})
```

## Use the Database

```ts
const newTag = await localful.db('tags').create({
  name: "Example Tag",
})
if (!newTag.success) {
  throw new Error("Well that's not good")
}

const newNote = await localful.db('notes').create({
  name: "Example Note",
  body: "This is an example note!",
  tags: [newTag.data.id],
})
if (!newNote.success) {
  throw new Error("Well that's also not good")
}

const allNotes = await localful.db('notes').getAll()
const note = await localful.db('notes').get(newNote.data.id)

await localful.db('tags').update(newTag.data.id, {
  name: 'Updated Tag'
})

await localful.db('tags').delete(newTag.data.id)
```

## Connect a Server
TODO

## Migrate Schema and Data

```ts
import z from "zod"
import {IdField} from "@localful/common"
import {LocalfulWeb, MigrationData} from "@localful/web"

export const _Notev1 = z.object({
  name: z.string(),
  body: z.string(),
  tags: z.array(IdField)
}).strict()
export type _Notev1 = z.infer<typeof Note>

export const Note = z.object({
  title: z.string(), 
  description: z.string().optional(),
  content: z.string(),
  tags: z.array(IdField)
}).strict()
export type Note = z.infer<typeof Note>

export const Tag = z.object({
  name: z.string(),
}).strict()
export type Tag = z.infer<typeof Tag>

// data could be any old type if you migrate more than one old version!
async function noteMigrations(localful: LocalfulWeb, migrationData: MigrationData, data: _Notev1): Promise<Note|undefined> {
  if (migrationData.currentVersion === '1' && migrationData.targetVersion === '2') {
    return {
      title: data.name,
      content: data.title,
      tags: data.tags
    }
  }
	
  // Returning no data means the 
}

export const localful = new LocalfulWeb({
  dataSchema: {
    notes: {
      version: '2', 
      schema: Note,
      migrations: noteMigrations
    },
    tags: {
      version: '1',
      schema: Tag
    }
  }
})
```
