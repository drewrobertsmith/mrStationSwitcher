import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface Props {
    color: string;
    onDone: () => void;
}

/**
 * A radial bloom that expands from the center and fades out.
 * Mount it briefly on station selection, then unmount via onDone.
 */
export function StationSelectedFlash({ color, onDone }: Props) {
    const scale = useSharedValue(0.1);
    const opacity = useSharedValue(0.45);

    useEffect(() => {
        scale.value = withSpring(4, { damping: 18, stiffness: 80 });
        opacity.value = withTiming(0, { duration: 600 }, (finished) => {
            if (finished) runOnJS(onDone)();
        });
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
        backgroundColor: color,
    }));

    return <Animated.View style={[styles.bloom, style]} pointerEvents="none" />;
}

const styles = StyleSheet.create({
    bloom: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: "center",
        top: "50%",
        marginTop: -40,
        zIndex: 10,
    },
});
