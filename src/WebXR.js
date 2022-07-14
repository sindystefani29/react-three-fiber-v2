import { forwardRef, Suspense, useEffect, useRef } from "react";
import { ARCanvas, DefaultXRControllers } from "@react-three/xr";
import { useLoader } from "@react-three/fiber";
import { Object3D } from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { throttle } from "lodash";

import "./styles.css";

const INITIAL_SCALE = 20;

const Model = forwardRef((props, ref) => {
    const gltf = useLoader(GLTFLoader, "./N01_Oak.gltf");
    return (
        <primitive
            ref={ref}
            position={[0, -10, -20]}
            object={gltf.scene}
            scale={INITIAL_SCALE}
            {...props}
        />
    );
});

export default function App() {
    const modelRef = useRef < Object3D | null > (null);

    useEffect(() => {
        // for swipe gesture
        let startX = 0;
        let startRotationX = 0;

        // for pinch gesture
        let initialDistance = 0;
        let initialScale = INITIAL_SCALE;

        const handleTouchStart = (event) => {
            if (event.targetTouches.length === 2) {
                /* store last scale value and initial distance between 2 fingers */
                initialDistance = Math.abs(
                    event.targetTouches[1].pageX - event.targetTouches[0].pageX
                );
                initialScale = modelRef.current?.scale.x || INITIAL_SCALE;
            } else {
                /* store last rotation value */
                const touchX = event.changedTouches[0].pageX;
                startX = touchX;
                startRotationX = modelRef.current?.rotation.y || 0;
            }
        };

        const handleTouchMove = (event) => {
            if (modelRef.current) {
                if (event.changedTouches.length === 2) {
                    /* 2 touches move -> scale object */
                    const currDistance = Math.abs(
                        event.changedTouches[1].pageX - event.changedTouches[0].pageX
                    );
                    const diffDistance = currDistance - initialDistance;
                    const diffDistanceScale = diffDistance / 10;
                    modelRef.current.scale.setX(initialScale + diffDistanceScale);
                    modelRef.current.scale.setY(initialScale + diffDistanceScale);
                    modelRef.current.scale.setZ(initialScale + diffDistanceScale);
                } else {
                    /* 1 touch move -> rotate object on Y axis */
                    const touchX = event.changedTouches[0].pageX;
                    const diffX = (touchX - startX) / window.innerWidth;

                    modelRef.current.rotation.y = startRotationX + diffX;
                }
            }
        };

        const throttledTouchStart = throttle(handleTouchStart, 100);
        const throttledTouchMove = throttle(handleTouchMove, 100);

        window.addEventListener("touchstart", throttledTouchStart);
        window.addEventListener("touchmove", throttledTouchMove);
        return () => {
            window.removeEventListener("touchstart", throttledTouchStart);
            window.removeEventListener("touchmove", throttledTouchMove);
        };
    }, []);

    return (
        <ARCanvas>
            <Suspense fallback={null}>
                <Model ref={modelRef} />
            </Suspense>
            <pointLight position={[10, 10, 10]} />
            <DefaultXRControllers />
        </ARCanvas>
    );
}
