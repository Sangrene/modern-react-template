import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import { defaultResource, resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { version } from "../../package.json";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { trace } from "@opentelemetry/api";

const SERVICE_NAME = "React Router v7 server";
const SERVICE_VERSION = version;

export const initServerTelemetry = () => {
  const exporter = new ConsoleSpanExporter(); // TODO: use a real exporter
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: SERVICE_NAME,
      [ATTR_SERVICE_VERSION]: SERVICE_VERSION,
    }),
    traceExporter: exporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    }),
  });
  sdk.start();
  const resource = defaultResource().merge(
    resourceFromAttributes({
      [ATTR_SERVICE_NAME]: SERVICE_NAME,
      [ATTR_SERVICE_VERSION]: SERVICE_VERSION,
    }),
  );
  
  const processor = new BatchSpanProcessor(exporter);
  
  const provider = new WebTracerProvider({
    resource: resource,
    spanProcessors: [processor],
  });
  
  provider.register();
  console.log("Initialized server telemetry");
};

export const getTracer = () => {
  return trace.getTracer(SERVICE_NAME, SERVICE_VERSION);
}

