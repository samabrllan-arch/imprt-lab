import math

# THREE.Spherical:
# x = radius * sin(phi) * sin(theta)
# y = radius * cos(phi)
# z = radius * sin(phi) * cos(theta)

def get_xyz(radius, theta, phi):
    x = radius * math.sin(phi) * math.sin(theta)
    y = radius * math.cos(phi)
    z = radius * math.sin(phi) * math.cos(theta)
    return x, y, z

print("theta = 0:", get_xyz(2.3, 0, math.pi * 0.49))
print("theta = pi/2:", get_xyz(2.3, math.pi * 0.5, math.pi * 0.49))
print("theta = pi:", get_xyz(2.3, math.pi, math.pi * 0.49))
print("theta = -pi/2:", get_xyz(2.3, -math.pi * 0.5, math.pi * 0.49))
