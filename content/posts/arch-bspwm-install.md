---
title: Arch Linux Installation Tutorial
description: >-
  Master the art of Arch Linux installation with this step-by-step tutorial
  designed for tech enthusiasts and beginners alike. Dive into the world of Arch
  Linux as we guide you through setting up your system, with a focus on
  installing a sleek and efficient window manager. Whether you're seeking full
  control over your Linux environment or just curious about Arch's power, this
  tutorial simplifies the process, making it accessible and rewarding.
summary: >-
  This Arch Linux Installation Tutorial offers a clear, step-by-step guide to
  installing Arch Linux with a focus on setting up a window manager. It's
  designed to be accessible for both beginners and tech enthusiasts, providing
  full control over your Linux environment while simplifying the installation
  process.
categories:
  - Linux Installations
tags:
  - Arch Linux
date: 2024-08-20T21:00:00.000Z
thumbnail:
  src: /images/terraform/arch-linux.png
  visibility: list
authorbox: false
sidebar: false
pager: false
toc: false
draft: false
weight: 1
---

**(Works with Arch ISO Image build as of: 2024.02.01)**

# Arch Linux with BSPWM Window Manager Installation Guide (UEFI & MBR)

## Table of Contents

* **[Disk Partitioning](#preparing-the-disk-for-system)**
  * [UEFI System](#for-uefi-system)
  * [MBR System](#for-mbr-system)
* **[Base System Installation](#base-system-installation)**
  * [Update Mirrors](#update-mirrors-using-reflector)
  * [Base System](https://github.com/XxAcielxX/arch-plasma-install#install-base-system)
  * [Generate fstab](#generate-fstab)
* **[Chroot](#chroot)**
  * [Swapfile (UEFI only)](#create-swapfile-uefi-only)
  * [Date & Time](#set-time--date)
  * [Language](#set-language)
  * [Hostname & Hosts](#set-hostname)
  * [Network Manager](#install--enable-networkmanager)
  * [ROOT Password](#set-root-password)
  * [GRUB Bootloader](#install-grub-bootloader)
    * [UEFI System](#for-uefi-system-1)
    * [MBR System](#for-mbr-system-1)
* **[Boot Freshly Installed System](#now-boot-into-your-freshly-installed-arch-system)**
  * [Add User](#add-new-user)
  * [Sudo Command](#allow-wheel-group-to-use-sudo-commands)
* **[User Login](#login-as-user)**
  * [Display Server & GPU Drivers](#xorg--gpu-drivers)
  * [Multilib Repository (32bit)](#enable-multilib-repo-optional)
  * [Display Manager (SDDM)](#install--enable-sddm)
  * [Desktop Environment (KDE Plasma)](#kde-plasma--applications)
  * [Audio Utilities & Bluetooth](#audio-utilities--bluetooth)
  * [Misc Applications](https://#my-required-applications)
* **[The Conclusion](#the-conclusion)**
* **[Extras (optional)](#extras-optional)**
  * [Yay](#install-yay)
  * [Zsh](#install-zsh)
  * [Change SHELL](#changing-your-shell)
* **[Theming & Customisations](#theming--customisations)**
* **[Maintenance, Performance Tuning & Monitoring](maintenance-performance-tuning--monitoring)**
* **[Changelog](#changelog)**

### Load Keymaps (for non US ENG Keyboard Users only)

For a list of all the available keymaps, use the command:

```
localectl list-keymaps
```

To search for a keymap, use the following command, replacing `[search_term]` with the code for your language, country, or layout:

```
localectl list-keymaps | grep -i [search_term]
```

### Now Loadkeys

```
loadkeys [keymap]
```

### Check for Internet Connectivity

```
ping -c 4 google.com
```

* If you are connected through Ethernet, then your Internet will be working out of the box.
* If you are using Wi-Fi, then use `wifi-menu` to connect to your local network.
* If this step is successful then we will head to next one.

### Update system clock

```
timedatectl set-ntp true
```

</br>

## Preparing the Disk for System

> :warning: Be extremely careful when managing your disks, incase you delete your precious data then DON'T blame me.Disk partitioning type (use UEFI or MBR, go according to your system).

## For UEFI System

### Disk Partitioning (UEFI)

We are going to make two partitions on our HDD, `EFI BOOT & ROOT` using `gdisk`.

* If you have a brand new HDD or if no partition table is found, then create GPT Partition Table by pressing `g`.

```
gdisk /dev/[disk name]
```

* \[disk name] = device to partition, find yours by running `lsblk`.
* We will be using one partition for our `/`, `/boot` & `/home`.

```
n = New Partition
simply press enter = 1st Partition
simply press enter = As First Sector
+512M = As Last sector (BOOT Partition Size)
ef00 = EFI Partition Type

n = New Partition again
simply press enter = 2nd Partition
simply press enter = As First Sector
simply press enter = As Last sector [ROOT Partition Size (using the remaining disk space left)]
8300 or simply press enter = EXT4 ROOT Partition Type

w = write & exit
```

### Format Partitions (UEFI)

```
mkfs.fat -F32 /dev/[efi partition name]
mkfs.ext4 /dev/[root partiton name]
```

### Mount Partitions (UEFI)

```
mount /dev/[root partition name] /mnt
mkdir /mnt/boot/efi
mount /dev/[efi partition name] /mnt/boot/efi
```

## For MBR System

### Disk Partitioning (MBR)

We are going to make two partitions on our HDD, `SWAP & ROOT` using `cfdisk`.

* If you have a brand new HDD or if no partition table is found, then create MSDos Partition Table by selecting `msdos`.

```
cfdisk /dev/[disk name]
```

* \[disk name] = device to partition, find yours by running `lsblk`.
* SWAP Partition should double the size of RAM available in your system. Not applicable on 16GB or more RAM.
* We will be using one partition for our `/`, `/boot` & `/home`.

### Format the Partition, Make SWAP & Mount ROOT (MBR)

#### Format ROOT Partition as EXT4

```
mkfs.ext4 /dev/[root partition name]
```

#### Make & Turn SWAP Partition on (MBR)

```
mkswap /dev/[swap partition name]
swapon /dev/[swap partition name]
```

#### Mount ROOT Partition (MBR)

```
mount /dev/[root partition name] /mnt
```

</br>

## Base System Installation

### Update Mirrors using Reflector

```
reflector -c County1 -c Country2 -a 12 -p https --sort rate --save /etc/pacman.d/mirrorlist
```

Replace `Country1` & `Country2` with countries near to you or with the one you're living in. Refer to **[Reflector](https://wiki.archlinux.org/index.php/reflector)** for more info.

### Install base system

```
pacstrap /mnt base base-devel linux linux-firmware linux-headers nano intel-ucode reflector mtools dosfstools
```

* Replace `linux` with *linux-hardened*, *linux-lts* or *linux-zen* to install the kernel of your choice.
* Replace `linux-headers` with Kernel type type of your choice respectively (e.g if you installed `linux-zen` then you will need `linux-zen-headers`).
* Replace `nano` with editor of your choice (i.e `vim` or `vi`).
* Replace `intel-ucode` with `amd-ucode` if you are using an AMD Processor.

### Generate fstab

(use `-U` or `-L` to define by [UUID](https://wiki.archlinux.org/index.php/UUID) or labels, respectively)

```
genfstab -U /mnt >> /mnt/etc/fstab
```

Check the resulting `/mnt/etc/fstab` file, and edit it in case of errors. </br>

## Chroot

```
arch-chroot /mnt
```

### Create Swapfile (UEFI only)

Replace the below 4096 in `count=4096` with double the amount of RAM installed your system. Not applicable on 16GB or more RAM.

```
dd if=/dev/zero of=/swapfile bs=1M count=4096 status=progress
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Add Swapfile entery in your `/etc/fstab` file (UEFI only)

```
/swapfile none swap defaults 0 0
```

Insert the above line at the bottom of `/etc/fstab`.

### Set Time & Date

```
ln -sf /usr/share/zoneinfo/Region/City /etc/localtime
hwclock --systohc
```

Replace `Region` & `City` according to your Time zone. Refer to **[Time zone](https://wiki.archlinux.org/index.php/installation_guide#Time_zone)** more info.

## Set Language

We will use `en_US.UTF-8` here but, if you want to set your language, replace `en_US.UTF-8` with yours in all below instances.

#### Edit locale.gen

```
nano /etc/locale.gen
```

Uncomment the below line

```
#en_US.UTF-8 UTF-8
```

save & exit.

### Generate Locale

```
locale-gen
```

### Add LANG to locale.conf

```
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

### Add Keymaps to vconsole

For keyboard users with non US Eng only. Replace `[keymap]` with yours.

```
echo "KEYMAP=[keymap]" > /etc/vconsole.conf
```

## Set Hostname

```
echo arch > /etc/hostname
```

Replace `arch` with hostname of your choice.

### Set Hosts

```
nano /etc/hosts
```

#### add these lines to it

```
127.0.0.1    localhost
::1          localhost
127.0.1.1    arch.localdomain arch
```

Replace `arch` with hostname of your choice.
save & exit.

### Install & Enable NetworkManager

```
pacman -S networkmanager
systemctl enable NetworkManager
```

### Set ROOT Password

```
passwd
```

### Install GRUB Bootloader

```
pacman -S grub
```

### Install EFI Boot manager (UEFI)

```
pacman -S efibootmgr
```

#### For UEFI System

```
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
```

#### For MBR System

```
grub-install --target=i386-pc /dev/[disk name]
```

### Create Grub configuration file

```
grub-mkconfig -o /boot/grub/grub.cfg
```

### Final Step

```
exit
umount -a
reboot
```

</br>

## Now boot into your freshly installed Arch system

### Login as ROOT

### Add new User

```
useradd -mG wheel [username]
```

Replace `[username]` with your username of choice.

### Set User Password

```
passwd [username]
```

### Allow Wheel Group to use Sudo Commands

```
EDITOR=nano visudo
```

#### Find and uncomment the below line

```
#%wheel ALL=(ALL) ALL
```

save & exit.

### Logout ROOT

```
exit
```

## Login as USER

### Check for updates

```
sudo pacman -Syu
```

### Xorg & GPU Drivers

```
sudo pacman -S xorg [xf86-video-your gpu type]
```

* For Nvidia GPUs, type `nvidia` & `nvidia-settings`. For more info/old GPUs, refer to [Arch Wiki - Nvidia](https://wiki.archlinux.org/index.php/NVIDIA).
* For newer AMD GPUs, type `xf86-video-amdgpu`.
* For legacy Radeon GPUs like HD 7xxx Series & below, type `xf86-video-ati`.
* For dedicated Intel Graphics, type `xf86-video-intel`.

### Enable Multilib Repo (optional)

multilib contains 32-bit software and libraries that can be used to run and build 32-bit applications on 64-bit installs (e.g. [Wine](https://www.winehq.org/), [Steam](https://store.steampowered.com/), etc).

Edit `/etc/pacman.conf` & uncomment the below two lines.

```
#[multilib]
#Include = /etc/pacman.d/mirrorlist
```

#### MESA Libraries (32bit)

This package is required by Steam if you play games using Vulkan Backend.

```
sudo pacman -S lib32-mesa
```

### KDE Plasma & Applications

```
sudo pacman -S alacritty aria2 bat bat-extras bspwm btrfs-progs evince eza feh ffmpeg firefox-developer-edition flameshot font-manager gimp github-cli gpick htop jq lazygit lxappearance mesa-utils mesa-vdpau mpv ncdu neovim nnn noto-fonts noto-fonts-cjk noto-fonts-extra npm opendoas pass pavucontrol pulseaudio-alsa python-pip python-pipx renameutils reflector ripgrep rofi spotify-launcher stow strawberry sxhkd sxiv terraform thunar tipp10 tmux transmission-cli trash-cli unrar unzip vim wget xorg xorg-xinit zip zsh xf86-video-amdgpu polybar libva-mesa-driver libva-vdpau-driver libva-utils pacman-contrib go  
```

<!-- Packages         | Description -->

<!-- ---------------- | ------------------------------------ -->

<!-- plasma           | KDE Plasma Desktop Environment. -->

<!-- konsole          | KDE Terminal. -->

<!-- dolphin          | KDE File Manager. -->

<!-- ark              | Archiving Tool. -->

<!-- kwrite           | Text Editor. -->

<!-- kcalc            | Scientific Calculator. -->

<!-- spectacle        | KDE screenshot capture utility. -->

<!-- krunner          | KDE Quick drop-down desktop search. -->

<!-- partitionmanager | KDE Disk & Partion Manager. -->

<!-- ### Audio Utilities & Bluetooth -->

<!-- ``` -->

<!-- sudo pacman -S alsa-utils bluez bluez-utils -->

<!-- ``` -->

<!-- Packages    | Description -->

<!-- ----------- | ----------------------------------------- -->

<!-- alsa-utils  | This contains (among other utilities) the `alsamixer` and `amixer` utilities. -->

<!-- bluez       | Provides the Bluetooth protocol stack. -->

<!-- bluez-utils | Provides the `bluetoothctl` utility. -->

<!-- #### Enable Bluetooth Service -->

<!-- ``` -->

<!-- sudo systemctl enable bluetooth.service -->

<!-- ``` -->

<!-- ### My Required Applications -->

<!-- You can install all the following packages or only the one you want. -->

<!-- ``` -->

<!-- sudo pacman -S firefox openssh qbittorrent audacious wget screen git neofetch -->

<!-- ``` -->

<!-- Packages        | Description -->

<!-- ----------------| ---------- -->

<!-- firefox         | Mozilla Firefox Web Browser. -->

<!-- openssh         | Secure Shell access server. -->

<!-- qbittorrent     | A BitTorrent Client based on Qt. -->

<!-- audacious       | Qt based music player. -->

<!-- wget            | Wget is a free utility for non-interactive download of files from the Web. -->

<!-- screen          | Is a full-screen window manager that multiplexes a physical terminal between several processes, typically interactive shells. -->

<!-- git             | Github command-line utility tools. -->

<!-- neofetch        | Neofetch is a command-line system information tool. -->

### Enable OpenSSH daemon

```
sudo systemctl enable sshd.service
```

### Final Reboot

```
reboot
```

</br>

### The Conclusion

Now everything is installed and after the final `reboot`, you will land in you GUI Login Screen ready to use your system. You can also do some extra steps mentioned below to further improve your experience. I'll recommend you to install `yay` & `paccache`.

* Yay will provide your packages from AUR (Arch User Repository), which are not available in the Official Repo.
* Paccache can be used clean pacman cached packages either manually or in an automated way.

## Extras (optional)

### Install [Yay](https://github.com/Jguer/yay)

Yet Another Yogurt - An AUR Helper.

```
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

### Install [Zsh](https://wiki.archlinux.org/index.php/zsh/)

Zsh is a powerful shell that operates as both an interactive shell and as a scripting language interpreter.

```
sudo pacman -S zsh zsh-completions
```

Read *[here](#install-oh-my-zsh)* for customisation & theming for Zsh. Read below how to change your SHELL.

### Changing your SHELL

First check your current SHELL by running:

```
echo $SHELL
```

#### To get list of all available/installed SHELLs:

```
chsh -l
```

### Set Zsh as our SHELL

For an example, we will set Zsh as default SHELL which we installed in the last step:

```
chsh -s /usr/bin/zsh
```

For the changes to apply, you will have Logout and Log back in or better do `reboot`.

</br>
