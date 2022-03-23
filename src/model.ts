import { input, output } from '@covid-policy-modelling/api'

export interface RunnerModelInput {
  modelInput: input.ModelInput
  inputFile: string
}

export interface Model {
  inputs(input: input.ModelInput): RunnerModelInput
  run(runInput: RunnerModelInput): Promise<output.ModelOutput>
}
