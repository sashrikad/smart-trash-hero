// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { PT_VERSION as version } from "@aws-lambda-powertools/commons";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";

const serviceName = "smart-trash";

const logger = new Logger({
  // serviceName,
  logLevel: "DEBUG",
  persistentLogAttributes: {
    logger: {
      version,
      name: "@aws-lambda-powertools/logger",
    },
  },
});

const tracer = new Tracer({
  serviceName,
});

export { logger, tracer };
