module Util {
  export class Math2 {
    
    static DEG_TO_RAD: number = 0.017453292519943295;
    
    /**
     * Convert a degree to a radian
     */
    static degToRad(deg: number): number {
      return deg * Math2.DEG_TO_RAD;
    }
    
  }
}