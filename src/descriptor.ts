require('dotenv').config();
import { Describe } from './interfaces';
import {
  beforeBuilder,
  beforeEachBuilder,
  afterBuilder,
  afterEachBuilder,
} from './hooks';
import { itsBuilder } from './it';
import { beforeAddConsoleGroups } from './before';

const checkDescriptor = (descriptor: Describe) => {
  if (!descriptor.name) {
    console.log(`\n⛔ ERROR: 'name' should be present for all descriptors`);
    process.exit(1);
  }

  if (descriptor.its && !Array.isArray(descriptor.its)) {
    console.log(
      `\n⛔ ERROR: 'its' invalid type, it should be present as an 'Array' for the following descriptor: `,
      descriptor.name
    );
    process.exit(1);
  }

  if (!descriptor.its) {
    descriptor.its = [];
  }
};

export const describersBuilder = (description: Describe) => {
  checkDescriptor(description);

  describe(`\n🏷️  ${description.name}`, async function () {
    beforeAddConsoleGroups(2);

    let timeout;

    if (process.env.TIMEOUT) {
      timeout = parseInt(process.env.TIMEOUT);
    }

    this.timeout(timeout);

    let hookBuilders = [
      { attribute: description.before, func: beforeBuilder },
      { attribute: description.beforeEach, func: beforeEachBuilder },
      { attribute: description.after, func: afterBuilder },
      { attribute: description.afterEach, func: afterEachBuilder },
    ];

    for (const builder of hookBuilders) {
      if (builder.attribute && Array.isArray(builder.attribute)) {
        for (const attr of builder.attribute) {
          builder.func(attr);
        }
      }
    }

    if (description.its && description.its.length > 0) {
      for (const it of description.its) {
        itsBuilder(it);
      }
    }

    if (description.describes && description.describes.length > 0) {
      for (const desc of description.describes) {
        describersBuilder(desc);
      }
    }
  });
};
