import { describe, expect, it } from 'vitest'
import { parseVideo } from './media'

describe('parseVideo', () => {
  it('herkent YouTube-links in verschillende vormen', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      'https://youtu.be/aqz-KE-bpKQ',
      'https://www.youtube.com/embed/aqz-KE-bpKQ',
      'https://m.youtube.com/watch?v=aqz-KE-bpKQ&t=3',
    ]) expect(parseVideo(url)).toEqual({ kind: 'youtube', id: 'aqz-KE-bpKQ' })
  })
  it('behandelt een bestandsnaam als eigen video in public/videos', () => {
    expect(parseVideo('demo.mp4')).toEqual({ kind: 'file', src: expect.stringMatching(/videos\/demo\.mp4$/) })
  })
  it('geeft none bij een leeg veld', () => {
    expect(parseVideo('  ')).toEqual({ kind: 'none' })
  })
})
