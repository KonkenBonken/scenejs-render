import { useStoreStateSetValue } from "@scena/react-store";
import * as React from "react";
import { ReactSceneResult } from "react-scenejs";
import { Poly } from "react-shape-svg";
import { $container, $scene } from "../RenderModal";
import { Progress } from "./Progress";

export interface GalleryItemProps {
    sceneComponent: React.ForwardRefExoticComponent<React.RefAttributes<ReactSceneResult>>;
    title: string;
    duration: string;
    width: number;
    height: number;
}
export function GalleryItem(props: GalleryItemProps) {
    const SceneComponent = props.sceneComponent;
    const galleryElementRef = React.useRef<HTMLDivElement>(null);
    const sceneRef = React.useRef<ReactSceneResult>(null);

    const setScene = useStoreStateSetValue($scene);
    const setContainer = useStoreStateSetValue($container);

    React.useEffect(() => {
        sceneRef.current!.setTime(0);
    }, []);

    React.useEffect(() => {
        const galleryElement = galleryElementRef.current!;
        const playButton = galleryElement.querySelector(".example-hover .play")!;
        const pausedButton = galleryElement.querySelector(".example-hover .paused")!;
        const scene = sceneRef.current!;

        function onPlay() {
            playButton.classList.remove("display");
            pausedButton.classList.add("display");
        }
        function onPaused() {
            playButton.classList.add("display");
            pausedButton.classList.remove("display");
        }

        scene.on("play", onPlay);
        scene.on("paused", onPaused);

        return () => {
            scene.off("play", onPlay);
            scene.off("paused", onPaused);
        };
    }, [sceneRef]);

    return (<div className="gallery-item" ref={galleryElementRef}>
        <h4 className="name" id="motion-effect">{props.title}</h4>
        <ul>
            <li>Size: {props.width} x {props.height}</li>
            <li>Duration: {props.duration}</li>
            <li>Code: <a href="https://github.com" target="_blank" rel="noreferrer">Github</a></li>
        </ul>
        <div className="record" onClick={() => {
            setContainer(galleryElementRef.current);
            setScene(sceneRef.current!);
        }}></div>
        <div className="example" style={{
            height: `${props.height}px`,
        }}>
            <div className="example-viewer">
                <div className="example-container" style={{
                    width: `${props.width}px`,
                }}>
                    <SceneComponent ref={sceneRef} />
                </div>
            </div>
            <div className="example-hover">
                <div className="button play display" onClick={() => {
                    sceneRef.current!.play();
                }}>
                    <Poly
                        strokeWidth={10}
                        left={5}
                        top={5}
                        right={5}
                        bottom={5}
                        width={50}
                        rotate={90}
                        fill="#333"
                        stroke="#333"
                    />
                </div>
                <div className="button paused" onClick={() => {
                    sceneRef.current!.pause();
                }}></div>
            </div>
        </div>
        <Progress sceneRef={sceneRef} />
        <div className="result" style={{
            height: `${props.height}px`,
        }}>
            <video controls={true} />
        </div>
    </div>);
}