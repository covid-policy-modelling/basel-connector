import * as d3 from 'd3'
import { output, input } from '@covid-policy-modelling/api'

export function convertOutput(
  modelInput: input.ModelInput,
  tsvContent: string
): output.ModelOutput {
  const timestamps = []
  const metrics: output.SeverityMetrics = {
    Mild: [],
    ILI: [],
    SARI: [],
    Critical: [],
    CritRecov: [],
    incDeath: [],
    cumMild: [],
    cumILI: [],
    cumSARI: [],
    cumCritical: [],
    cumCritRecov: [],
  }

  const metricNames = Object.keys(metrics)

  const rows = d3.tsvParse(tsvContent)
  for (const row of rows) {
    timestamps.push(+row.t)
    for (const key of metricNames) {
      const value = row[key]
      metrics[key].push(+value)
    }
  }

  return {
    metadata: modelInput,
    model: {
      name: 'CovidSim (Imperial)',
      modelVersion: process.env.COVIDSIM_VERSION,
      connectorVersion: process.env.CONNECTOR_VERSION,
    },
    time: {
      t0: '2020-01-01',
      timestamps,
      extent: [timestamps[0], timestamps[timestamps.length - 1]] as [
        number,
        number
      ],
    },
    aggregate: { metrics },
  }
}
