module Resource {
  export class Lyric {
    static config = {
      artist: 'youss',
      songs: [{
        title: 'LE SCORE',
        lines: [
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "on s'en sort",
          "fais peter LE SCORE",
          "j'suis en plein essor",
          "on s'en sort",
          "fais peter LE SCORE",
          "on s'en sort",
          "fais peter LE SCORE",
          "fais peter LE SCORE",
          "on s'en sort",
          "j'fais peter LE SCORE",
          "peter LE SCORE",
          "on s'en sort",
          "j'suis en plein essor",
        ]  
      }] 
    };
    
    static get(key: string): any {
      return Lyric.get(key);
    }
  }
}

