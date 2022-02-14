import { Describe } from "./interfaces/test"
import { beforeBuilder, beforeEachBuilder, afterBuilder, afterEachBuilder  } from "./hooks"
import { itsBuilder } from "./it"

const checkDescriptor = (descriptor: Describe) => {
  if (!descriptor.name) {
    console.log(`\n⚠️  "name" should be defined for all descriptors`)
    process.exit(1)
  }

  if (!descriptor.its) {
    console.log(`\n⚠️  "its" can not be empty and should be defined for descriptor if there are not other nested descriptors for: "${descriptor.name}"`)
    process.exit(1)
  }
}

export const describersBuilder = (description: Describe) => {
  checkDescriptor(description)

  describe(`📚 ${description.name}`, async () => {
    before(function () {
      for (let i = 0; i < 4; i++){
        console.group()
      }
    })

    after(function () {
      for (let i = 0; i < 4; i++){
        console.groupEnd()
      }
    })
    let indent = 0

    let hookBuilders = [
      { attribute: description.before, func: beforeBuilder },
      { attribute: description.beforeEach, func: beforeEachBuilder },
      { attribute: description.after, func: afterBuilder },
      { attribute: description.afterEach, func: afterEachBuilder },
    ]

    for (const builder of hookBuilders) {
      if (builder.attribute && builder.attribute.length > 0)
        for (const attr of builder.attribute) {
          builder.func(attr, indent)
        }
    }

    if (description.its && description.its.length > 0) {
      for (const it of description.its) {
        itsBuilder(it, indent)
      }
    }

    if (description.describes && description.describes.length > 0) {
      for (const desc of description.describes) {
          describersBuilder(desc)
      }
    }
  })
}