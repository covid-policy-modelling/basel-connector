import * as fs from 'fs'
import * as path from 'path'
import * as stream from 'stream'
import * as Dockerode from 'dockerode'
import {
  DOCKER_PASSWORD,
  DOCKER_USER,
  HOST_WORK_DIR,
  INPUT_DIR,
  LOG_DIR,
  OUTPUT_DIR,
} from './config'
import { logger } from './logger'

export async function imageHash(
  client: Dockerode,
  image: string
): Promise<string> {
  const imageDetails = await client.getImage(image).inspect()
  return imageDetails.Id
}

export async function pullImage(
  client: Dockerode,
  image: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    client.pull(
      image,
      {
        authconfig: {
          username: DOCKER_USER,
          password: DOCKER_PASSWORD,
        },
      },
      (err, strm) => {
        // TODO: Consider using dockerClient.modem.followProgress(strm, onFinished, onProgress)
        let message = ''
        if (err) return reject(err)
        strm.on('data', data => {
          message += data
        })
        strm.on('end', () => {
          logger.info('Docker pull complete')
          resolve(message)
        })
        strm.on('error', streamErr => {
          logger.warn('Docker pull failed')
          logger.error(streamErr)
          reject(streamErr)
        })
      }
    )
  })
}

export async function runContainer(
  client: Dockerode,
  image: string
): Promise<number> {
  // Setup the log file.
  const logFile = path.join(LOG_DIR, 'runner.log')
  const logWriteStream = fs.createWriteStream(logFile, {
    flags: 'w',
    encoding: 'utf-8',
  })
  const combinedStream = new stream.PassThrough()
  combinedStream.pipe(process.stdout)
  combinedStream.pipe(logWriteStream)
  return new Promise((resolve, reject) => {
    client.run(
      image,
      [],
      combinedStream,
      {
        HostConfig: {
          Binds: [
            `${HOST_WORK_DIR}/${path.basename(INPUT_DIR)}:/data/input:rw`,
            `${HOST_WORK_DIR}/${path.basename(OUTPUT_DIR)}:/data/output:rw`,
          ],
        },
      },
      {},
      (err, result) => {
        // TODO: Consider using dockerClient.modem.followProgress(strm, onFinished, onProgress)
        // or some equivalent for result
        if (err) return reject(err)
        logger.info(result)
        // const output = result[0]
        // const container = result[1]
        logger.info('Model exited with status code: %d', result.StatusCode)
        // resolve(container.remove())
        if (result.Error) {
          reject(result.Error)
        } else {
          resolve(result.StatusCode)
        }
      }
    )
  })
}
