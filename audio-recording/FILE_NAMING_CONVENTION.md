# Audio File Naming Convention

## File Structure:
```
audio-recording/
├── raw/                    # Original recordings
│   ├── om-namah-shivaya-raw.wav
│   ├── gayatri-mantra-raw.wav
│   └── ...
├── processed/              # Edited files
│   ├── om-namah-shivaya-processed.wav
│   ├── gayatri-mantra-processed.wav
│   └── ...
└── final/                  # Final MP3 files
    ├── om-namah-shivaya.mp3
    ├── gayatri-mantra.mp3
    └── ...
```

## Naming Convention:
- Use lowercase with hyphens
- Match mantra slug from database
- Include file type extension
- No spaces or special characters

## Database Mapping:
| Mantra Slug | File Name | Database URL |
|-------------|-----------|--------------|
| om-namah-shivaya | om-namah-shivaya.mp3 | https://cdn.example.com/audio/om-namah-shivaya.mp3 |
| gayatri-mantra | gayatri-mantra.mp3 | https://cdn.example.com/audio/gayatri-mantra.mp3 |
| mahamrityunjaya | mahamrityunjaya-mantra.mp3 | https://cdn.example.com/audio/mahamrityunjaya-mantra.mp3 |

## Quality Standards:
- **Format**: MP3 320kbps
- **Duration**: 30-60 seconds
- **File Size**: <2MB per file
- **Sample Rate**: 44.1kHz
- **Channels**: Mono
