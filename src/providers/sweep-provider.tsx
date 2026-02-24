import { LinearGradient } from "expo-linear-gradient";
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

interface SweepContextValue {
    triggerSweep: (pageY: number, color: string) => void;
}

interface SweepState {
    pageY: number;
    color: string;
    id: number;
}

const SweepContext = createContext<SweepContextValue | null>(null);

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/** Expands from the tap origin upward + downward, feathering at both edges. */
function SweepOverlay({
    pageY,
    color,
    onDone,
}: {
    pageY: number;
    color: string;
    onDone: () => void;
}) {
    const { height: screenH } = useWindowDimensions();

    // top and bottom edges both start at the item's center Y, expanding outward
    const top = useSharedValue(pageY);
    const bottom = useSharedValue(pageY);
    const opacity = useSharedValue(0.32);

    const ease = Easing.bezier(0.16, 1, 0.3, 1);

    React.useEffect(() => {
        const expandDuration = 520;
        top.value = withTiming(0, { duration: expandDuration, easing: ease });
        bottom.value = withTiming(screenH, {
            duration: expandDuration,
            easing: ease,
        });
        // Start fading just before the expand finishes
        opacity.value = withDelay(
            440,
            withTiming(0, { duration: 400 }, (finished) => {
                if (finished) runOnJS(onDone)();
            }),
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        position: "absolute",
        left: 0,
        right: 0,
        top: top.value,
        height: Math.max(0, bottom.value - top.value),
        opacity: opacity.value,
    }));

    return (
        <AnimatedGradient
            // Feathered: transparent at both expanding edges, solid in the centre band
            colors={["transparent", color, color, "transparent"]}
            locations={[0, 0.22, 0.78, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={style}
            pointerEvents="none"
        />
    );
}

/** Wrap the root layout with this to enable full-screen sweeps from any station tap. */
export function SweepProvider({ children }: { children: React.ReactNode }) {
    const [sweep, setSweep] = useState<SweepState | null>(null);
    const idRef = useRef(0);

    const triggerSweep = useCallback((pageY: number, color: string) => {
        idRef.current += 1;
        setSweep({ pageY, color, id: idRef.current });
    }, []);

    return (
        <SweepContext.Provider value={{ triggerSweep }}>
            <Animated.View style={{ flex: 1 }}>
                {children}
                {sweep && (
                    <SweepOverlay
                        key={sweep.id}
                        pageY={sweep.pageY}
                        color={sweep.color}
                        onDone={() => setSweep(null)}
                    />
                )}
            </Animated.View>
        </SweepContext.Provider>
    );
}

export function useSweep(): SweepContextValue {
    const ctx = useContext(SweepContext);
    if (!ctx) throw new Error("useSweep must be used within a SweepProvider");
    return ctx;
}
