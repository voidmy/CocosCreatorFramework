import { _decorator, Vec3, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class Util {
    static m_orientations: Vec3[] = [
        new Vec3(0, 0, -1),
        new Vec3(-1, 0, 0),
        new Vec3(1, 0, 0)
    ]


    public static GetOrientationVector(o: Orientation): Vec3 {
        return this.m_orientations[o];
    }

    public static getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static CopyVec3(old: Vec3): Vec3 {
        return new Vec3(old.x, old.y, old.z);
    }

    public static RemoveArrItem(arr: any[], item) {
        let index = arr.findIndex((x)=>{return x===item});
        if (index != -1) {
            arr.splice(index, 1);
        }
    }

}
export enum Orientation {
    Forward = 0,
    //Left = 1,
    Right = 2,
}

